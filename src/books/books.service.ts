import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schemas/book.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BookStatus } from './enums/book-status.enum';
import { BookLoan } from './schemas/book-loan.schema';
import { LoanStatus } from './enums/loan-status.enum';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<Book>,
    @InjectModel(BookLoan.name) private bookLoanModel: Model<BookLoan>,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
  ) {}

  create(createBookDto: CreateBookDto) {
    return this.bookModel.create(createBookDto);
  }

  findAll() {
    return this.bookModel.find();
  }

  findAvailable() {
    return this.bookModel.find({ status: BookStatus.AVAILABLE });
  }

  async findBorrowed(id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.bookLoanModel
      .find({ user: String(user._id), status: LoanStatus.ACTIVE })
      .populate('book');
  }

  async findOne(id: string) {
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    book.set(updateBookDto);
    return book.save();
  }

  remove(id: string) {
    return this.bookModel.findByIdAndDelete(id);
  }

  search(query: string) {
    return this.bookModel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    });
  }

  async borrow(id: string, userId: string) {
    const user = await this.usersService.findOne(userId);
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    if (book.status === BookStatus.BORROWED) {
      throw new NotFoundException('Book is already borrowed');
    }
    book.status = BookStatus.BORROWED;
    await book.save();
    const isCreated = await this.bookLoanModel.create({
      book: book.id,
      user: String(user._id),
      status: LoanStatus.ACTIVE,
    });
    if (!isCreated) {
      throw new NotFoundException('Loan not created');
    }
    return { message: 'Book borrowed successfully' };
  }

  async return(id: string, userId: string) {
    const user = await this.usersService.findOne(userId);
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    if (book.status === BookStatus.AVAILABLE) {
      throw new NotFoundException('Book is not borrowed');
    }
    book.status = BookStatus.AVAILABLE;
    await book.save();
    const loan = await this.bookLoanModel.findOne({
      user: String(user._id),
      book: book.id,
      status: LoanStatus.ACTIVE,
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }
    loan.status = LoanStatus.RETURNED;
    return loan.save();
  }

  getLoans() {
    return this.bookLoanModel.find();
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleCron() {
    const loans = await this.bookLoanModel
      .find({
        status: LoanStatus.ACTIVE,
      })
      .populate('book')
      .populate('user');

    loans.forEach((loan) => {
      if (loan.borrowDate.getTime() + 7 * 24 * 60 * 60 * 1000 < Date.now()) {
        this.mailService.sendMail({
          to: loan.user.email,
          subject: 'Return your borrowed books',
          text: `Please return your borrowed book "${loan.book.title}" on time`,
        });
      }
    });
  }
}

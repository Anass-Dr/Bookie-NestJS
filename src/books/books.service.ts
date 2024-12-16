import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schemas/book.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BookStatus } from './enums/book-status.enum';
import { BookLoan } from './schemas/book-loan.schema';
import { LoanStatus } from './enums/loan-status.enum';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<Book>,
    @InjectModel(BookLoan.name) private bookLoanModel: Model<BookLoan>,
  ) {}

  create(createBookDto: CreateBookDto) {
    return this.bookModel.create(createBookDto);
  }

  findAll() {
    return this.bookModel.find();
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

  async borrow(id: string) {
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    if (book.status === BookStatus.BORROWED) {
      throw new NotFoundException('Book is already borrowed');
    }
    book.status = BookStatus.BORROWED;
    await book.save();
    return this.bookLoanModel.create({
      book: book.id,
      user: '67602df30aa68e9570241294',
      status: LoanStatus.ACTIVE,
    });
  }

  async return(id: string) {
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
}

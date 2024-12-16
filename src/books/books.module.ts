import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookLoan, BookLoanSchema } from './schemas/book-loan.schema';
import { Book, BookSchema } from './schemas/book.schema';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: BookLoan.name, schema: BookLoanSchema },
    ]),
    MailModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LoanStatus } from '../enums/loan-status.enum';
import { Book } from './book.schema';
import { User } from '../../users/schemas/user.schema';

export type BookLoanDocument = HydratedDocument<BookLoan>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
})
export class BookLoan {
  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  book: Book;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true, default: Date.now })
  borrowDate: Date;

  @Prop()
  returnDate?: Date;

  @Prop({
    type: String,
    enum: LoanStatus,
    default: LoanStatus.ACTIVE,
  })
  status: LoanStatus;
}

export const BookLoanSchema = SchemaFactory.createForClass(BookLoan);

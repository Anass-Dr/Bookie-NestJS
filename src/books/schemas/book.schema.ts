import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BookCategory } from '../enums/book-category.enum';
import { BookStatus } from '../enums/book-status.enum';

export type BookDocument = HydratedDocument<Book>;

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
export class Book {
  @Prop({ required: true, unique: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  author: string;

  @Prop({ required: true, enum: BookCategory })
  category: BookCategory;

  @Prop({ required: true })
  publicationYear: number;

  @Prop({
    type: String,
    enum: BookStatus,
    default: BookStatus.AVAILABLE,
  })
  status: BookStatus;

  @Prop({ trim: true })
  description?: string;

  @Prop()
  coverImageUrl?: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);

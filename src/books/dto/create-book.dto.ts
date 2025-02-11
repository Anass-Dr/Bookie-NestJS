import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BookCategory } from '../enums/book-category.enum';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(BookCategory)
  category: BookCategory;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  publicationYear: number;

  @IsString()
  @IsOptional()
  description?: string;
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ValidateObjectIdPipe } from '../common/validate-object-id.pipe';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.booksService.search(query);
  }

  @Get('loans')
  findLoans() {
    return this.booksService.getLoans();
  }

  @Get(':id')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  @Post(':id/borrow')
  borrow(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.booksService.borrow(id);
  }

  @Post(':id/return')
  return(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.booksService.return(id);
  }

  @Delete(':id')
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.booksService.remove(id);
  }
}

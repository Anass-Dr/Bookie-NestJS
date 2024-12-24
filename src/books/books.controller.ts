import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
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

  @Get('available')
  findAvailable() {
    return this.booksService.findAvailable();
  }

  @Get('borrowed/:id')
  findBorrowed(@Param('id') id: string) {
    return this.booksService.findBorrowed(id);
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
  borrow(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body('userId') userId: string,
  ) {
    return this.booksService.borrow(id, userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':id/return')
  return(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body('userId') userId: string,
  ) {
    return this.booksService.return(id, userId);
  }

  @Delete(':id')
  remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.booksService.remove(id);
  }
}

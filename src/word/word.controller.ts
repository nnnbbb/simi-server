import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuggestDto } from '../suggest/dto/suggest.dto';
import { CreateWordBookDto } from './dto/create-word.dto';
import { UpdateWordBookDto } from './dto/update-word.dto';
import { WordService } from './word.service';

@Controller('word')
@ApiTags("单词本")
export class WordController {
  constructor(
    private readonly wordService: WordService,
  ) { }

  @Post()
  create(@Body() dto: CreateWordBookDto) {
    return this.wordService.create(dto);
  }

  @Get()
  findAll() {
    return this.wordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWordBookDto) {
    return this.wordService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wordService.remove(+id);
  }

  @Post('phonetic-symbol')
  @ApiOperation({ summary: "音标爬取" })
  async phoneticSymbol(@Query() dto: SuggestDto) {
    return this.wordService.getWord(dto.word)
  }
}

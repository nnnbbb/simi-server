import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CustomQuery } from '../common/decorators/query.decorator';
import { SuggestDto } from '../suggest/dto/suggest.dto';
import { CreateWordDto } from './dto/create-word.dto';
import { QueryWordDto } from './dto/query-word.dto';
import { UpdateWordBookDto } from './dto/update-word.dto';
import { WordService } from './word.service';

@Controller('word')
@ApiTags("单词")
export class WordController {
  constructor(
    private readonly wordService: WordService,
  ) { }

  @Post()
  @ApiOperation({ summary: "创建" })
  create(@Body() dto: CreateWordDto) {
    return this.wordService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "列表" })
  @ApiQuery({ type: QueryWordDto })
  findAll(@CustomQuery() query: QueryWordDto) {
    return this.wordService.findAll(query);
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
  @ApiOperation({ summary: "删除" })
  remove(@Param('id') id: string) {
    return this.wordService.remove(+id);
  }

  @Post('phonetic-symbol')
  @ApiOperation({ summary: "音标爬取" })
  async phoneticSymbol(@Query() dto: SuggestDto) {
    return this.wordService.getWord(dto.word)
  }
}

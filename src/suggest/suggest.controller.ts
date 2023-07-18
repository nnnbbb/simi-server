import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import fetch from 'node-fetch';
import { SuggestDto } from './dto/suggest.dto';
import { SuggestService } from './suggest.service';

@Controller('suggest')
@ApiTags("suggest")
export class SuggestController {
  constructor(private readonly suggestService: SuggestService) { }

  @Get()
  @ApiOperation({ summary: "单词提示" })
  async suggest(@Query() dto: SuggestDto) {
    let f = await fetch(`https://dict.youdao.com/suggest?num=5&ver=3.0&doctype=json&cache=false&le=en&q=${dto.word}`)
    let res = await f.json()
    return { ...res }
  }

}

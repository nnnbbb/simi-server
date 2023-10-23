import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CustomResponse } from '../common/decorators/custom-response.decorator';
import { CustomQuery } from '../common/decorators/query.decorator';
import { WordResDto } from '../word/dto/create-word.dto';
import { MemoryDto } from './dto/memory.dto';
import { QueryMemoryDto } from './dto/query-memory.dto';
import { QueryRecordDto, QueryRecordResDto } from './dto/query-record.dto';
import { RecordService } from './record.service';

@Controller('record')
@ApiTags("记录")
export class RecordController {
  constructor(
    private readonly recordService: RecordService,
  ) { }


  @Get()
  @ApiQuery({ type: QueryRecordDto })
  @CustomResponse({ type: QueryRecordResDto })
  @ApiOperation({ summary: "单词时间线" })
  query(@CustomQuery() dto: QueryRecordDto) {
    return this.recordService.findAll(dto);
  }

  @Get('memory')
  @ApiQuery({ type: QueryMemoryDto })
  @CustomResponse({ type: WordResDto })
  @ApiOperation({ summary: "获取需要记忆的单词" })
  getMemory(@CustomQuery() dto: QueryMemoryDto) {
    return this.recordService.getMemory(dto)
  }

  @Post('memory')
  @ApiBody({ type: MemoryDto })
  @ApiOperation({ summary: "增加记忆次数" })
  memory(@Body() dto: MemoryDto) {
    return this.recordService.memory(dto)
  }

}

import { Controller, Get } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { CustomResponse } from '../common/decorators/custom-response.decorator';
import { CustomQuery } from '../common/decorators/query.decorator';
import { QueryRecordDto, QueryRecordResDto } from './dto/query-record.dto';
import { RecordService } from './record.service';

@Controller('record')
export class RecordController {
  constructor(
    private readonly recordService: RecordService,
  ) { }


  @Get()
  @ApiQuery({ type: QueryRecordDto })
  @CustomResponse({ type: QueryRecordResDto })
  query(@CustomQuery() dto: QueryRecordDto) {
    return this.recordService.findAll(dto);
  }

}

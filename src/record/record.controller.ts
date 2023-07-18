import { Controller, Get } from '@nestjs/common';
import { CustomResponse } from '../common/decorators/custom-response.decorator';
import { QueryRecordResDto } from './dto/query-record.dto';
import { RecordService } from './record.service';

@Controller('record')
export class RecordController {
  constructor(
    private readonly recordService: RecordService,
  ) { }


  @Get()
  @CustomResponse({ type: QueryRecordResDto })
  query() {
    return this.recordService.findAll();
  }

}

import { Global, Module } from '@nestjs/common';
import { LoggerService } from './providers/logger.service';
import { UtilService } from './providers/util.service';

@Global()
@Module({
  providers: [
    UtilService,
    LoggerService,
  ],
  exports: [
    UtilService,
    LoggerService,
  ],
})
export class CommonModule { }
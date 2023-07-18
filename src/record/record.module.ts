import { Module } from '@nestjs/common';
import { SentenceModule } from '../sentence/sentence.module';
import { WordModule } from '../word/word.module';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';

@Module({
  imports: [
    WordModule,
    SentenceModule,
  ],
  controllers: [RecordController],
  providers: [RecordService]
})
export class RecordModule { }

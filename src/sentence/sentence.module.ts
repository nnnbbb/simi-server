import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sentence } from './entities/sentence.entity';
import { SentenceController } from './sentence.controller';
import { SentenceService } from './sentence.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sentence,
    ]),
  ],
  controllers: [
    SentenceController,
  ],
  providers: [
    SentenceService,
  ],
})
export class SentenceModule { }

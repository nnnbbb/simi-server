import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entities/word.entity';
import { WordController } from './word.controller';
import { WordRepository } from './word.repository';
import { WordService } from './word.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Word,
  ])],
  controllers: [
    WordController,
  ],
  providers: [
    WordService,
    WordRepository,
  ],
  exports: [
    WordService,
    WordRepository,
  ],
})
export class WordModule { }

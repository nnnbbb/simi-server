import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../common/repositories/base.repository';
import { Word } from './entities/word.entity';

@Injectable()
export class WordRepository extends BaseRepository<Word> {
  constructor(private readonly dataSource: DataSource) {
    super(Word, dataSource.manager);
  }
}

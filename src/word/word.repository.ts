import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../common/repositories/base.repository';
import { WordBook } from './entities/word.entity';

@Injectable()
export class WordRepository extends BaseRepository<WordBook> {
  constructor(private readonly dataSource: DataSource) {
    super(WordBook, dataSource.manager);
  }
}

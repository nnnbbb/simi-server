import { Injectable } from '@nestjs/common';
import { WordRepository } from '../word/word.repository';

@Injectable()
export class RecordService {
  constructor(
    private readonly wordBookRepository: WordRepository,
  ) { }

  async findAll() {
    const res = await this.wordBookRepository.find({ order: { id: "DESC" } });
    return { list: res }
  }

}

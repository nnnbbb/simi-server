import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { WordRepository } from '../word/word.repository';
import { QueryRecordDto } from './dto/query-record.dto';

@Injectable()
export class RecordService {
  constructor(
    private readonly wordRepository: WordRepository,
  ) { }

  async findAll(dto: QueryRecordDto) {
    let query = await this.wordRepository.createQueryBuilder("word")
      .select("word.recordTime AS recordTime")
      .offset(dto.page)
      .limit(dto.pageSize)
      .orderBy("recordTime", dto.sort)
      .groupBy("word.recordTime")
      .getRawMany()
    const res = await this.wordRepository.find({
      where: {
        recordTime: In(query.map(it => it.recordTime)),
      },
      order: { id: "DESC" },
    });
    return { list: res }
  }

}

import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { WordRepository } from '../word/word.repository';
import { MemoryDto } from './dto/memory.dto';
import { QueryMemoryDto } from './dto/query-memory.dto';
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

  async getMemory(dto: QueryMemoryDto) {
    let sql = this.wordRepository.createQueryBuilder("word")

    if (dto.recordTime) {
      sql.andWhere("word.recordTime = :recordTime", { recordTime: dto.recordTime })
    }

    let word = await sql.orderBy({ memoryTimes: "ASC" }).getOne()

    return word
  }

  memory(dto: MemoryDto) {
    return this.wordRepository.increment({ word: dto.word }, "memoryTimes", 1)
  }


}

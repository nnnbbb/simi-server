import { Injectable, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import fetch from 'node-fetch';
import { DOMParser } from "xmldom";
import xpath from 'xpath';
import { CreateWordBookDto } from './dto/create-word.dto';
import { UpdateWordBookDto } from './dto/update-word.dto';
import { WordRepository } from './word.repository';


@Injectable()
export class WordService {
  constructor(
    private readonly wordRepository: WordRepository,
  ) { }

  async create(dto: CreateWordBookDto) {
    let word = await this.getWord(dto.word)
    return this.wordRepository.findOrInsert({
      ...word,
      recordTime: dayjs(Date.now()).format("YYYY-MM-DD"),
    }, ['word'])
  }

  findAll() {
    return this.wordRepository.find()
  }

  findOne(id: number) {
    return this.wordRepository.findOneBy({ id })
  }

  update(id: number, dto: UpdateWordBookDto) {
    return this.wordRepository.update(id, dto)
  }

  remove(id: number) {
    return this.wordRepository.softDelete({ id })
  }

  /**
   * @description: 获取音标和中文
   * @param word 
   */
  async getWord(word: string) {
    let url = `http://dict.youdao.com/w/eng/${word}`

    let f = await fetch(url)
    let text = await f.text()
    try {
      let phoneticSymbol = this.phoneticSymbol(text);
      let chinese = this.chinese(text);
      const res = {
        word,
        url,
        phoneticSymbol,
        chinese: chinese.join("; "),
      };
      return res

    } catch (err) {
      throw new NotFoundException({ message: "未找到单词, 请检查拼写", url })
    }
  }
  /**
   * @description: 获取音标
   * @param html 
   */
  phoneticSymbol(html: string) {
    try {
      let reg = />美\s+<span class="phonetic">([\S\W\]]+?)</g;
      let result = reg.exec(html);
      return result[1]

    } catch (err) {
      return ""
    }
  }
  /**
   * @description: 获取中文
   * @param html 
   */
  chinese(html: string) {
    // 匹配中文意思
    let reg2 = /<div[^>]*class="trans-container"[^>]*>([^]*?)<\/div>/g;
    let result2 = reg2.exec(html);

    let xml = result2[1]
    let doc = new DOMParser({
      errorHandler: {
        warning: function (w) { },
        error: function (e) { },
        fatalError: function (e) { console.error(e) }
      }
    }).parseFromString(xml)
    let nodes = xpath.select("//li", doc) as any[]
    let chinese = nodes.map(node => node.firstChild.data)
    return chinese
  }


}

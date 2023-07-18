import dayjs from "dayjs";
import { Column, Entity } from "typeorm";
import { Base } from "../../common/entities/base.entity";


@Entity({ name: 'word_book' })
export class WordBook extends Base {
  @Column({
    comment: "单词",
    unique: true,
  })
  word: string

  @Column({
    comment: "音标",
  })
  phoneticSymbol: string

  @Column({
    comment: "中文",
  })
  chinese: string

  @Column({
    comment: "记录时间",
    type: "date",
    default: dayjs(new Date()).format("YYYY-MM-DD"),
  })
  recordTime: string
}

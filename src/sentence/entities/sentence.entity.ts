import dayjs from "dayjs";
import { Column, Entity } from "typeorm";

@Entity({ name: 'sentences' })
export class Sentence {

  @Column({
    comment: "英文句子",
  })
  sentence: string

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

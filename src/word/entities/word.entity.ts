import { Column, Entity } from "typeorm";
import { Base } from "../../common/entities/base.entity";


@Entity({ name: 'word' })
export class Word extends Base {
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
  })
  recordTime: string

  @Column({
    comment: "记忆次数",
    default: '0'
  })
  memoryTimes: string
}

import dayjs from "dayjs";
import { AfterLoad, BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class Base extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: "主键",
  })
  id!: number;

  @CreateDateColumn({
    comment: "创建时间",
    type: Date,
  })
  @Index()
  createdAt!: string;

  @UpdateDateColumn({
    comment: "更新时间",
    type: Date,
  })
  updatedAt!: string

  @DeleteDateColumn({
    comment: '删除时间',
    type: Date,
  })
  deletedAt!: string

  @Column({
    comment: '删除id',
    nullable: true,
  })
  deletedId!: string

  @AfterLoad()
  afterLoad() {
    this.createdAt = this.createdAt && dayjs(this.createdAt).format("YYYY-MM-DD HH:mm:ss")
    this.updatedAt = this.createdAt && dayjs(this.updatedAt).format("YYYY-MM-DD HH:mm:ss")
    this.deletedAt = this.deletedAt && dayjs(this.deletedAt).format("YYYY-MM-DD HH:mm:ss")
  }
}

import _ from "lodash";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { BaseRepository } from "../repositories/base.repository";
import { Page } from "./page";

export abstract class CurdService<T> {
  constructor(
    private readonly repository: BaseRepository<T>,
  ) { }

  /**
   * @description: 构造查询条件的钩子函数
   * @param query
   */
  abstract findAllWhere?(query: any, queryBuilder: SelectQueryBuilder<T>): void;

  async findAll(query: any): Promise<Page<T>> {
    let selectQueryName = (this.repository.target as ObjectLiteral).name as string
    selectQueryName = _.lowerFirst(selectQueryName)
    let queryBuilder = this.repository.createQueryBuilder(selectQueryName);
    // 引用传递
    this.findAllWhere(query, queryBuilder)

    const { page, pageSize, sort } = query
    const key = `${selectQueryName}.id`
    queryBuilder = queryBuilder
      .skip(page)
      .take(pageSize)
      .orderBy({
        [key]: sort ? sort : "DESC"
      })

    const [list, total] = await queryBuilder.getManyAndCount()
    return { total, list }
  }

  create(dto: any): Promise<T> {
    return this.repository.createOne(dto)
  }

  findOne(id: number): Promise<T> {
    let where: {} = { id }
    return this.repository.findOne({ where })
  }

  update(id: number, dto: any): any {
    return this.repository.update(id, dto)
  }

  remove(id: number): any {
    let where: {} = { id }
    return this.repository.softDelete(where)
  }

}

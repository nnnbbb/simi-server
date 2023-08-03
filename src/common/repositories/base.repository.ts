import assert from "assert";
import { asyncPool, filterByKeys, filterWhere } from "src/utils/common";
import { DeepPartial, FindOptionsWhere, Repository, TypeORMError } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export class BaseRepository<T> extends Repository<T> {

  /**
   * @description: 根据id查找
   * @param id 
   */
  async findById(id: number | string | Date) {
    let where: FindOptionsWhere<any> = { id: id }
    return this.findOneBy(where)
  }

  /**
   * @description: 查找并更新
   */
  async findAndUpdate(where: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<T> {
    let entity = await this.findOneBy(where)
    if (entity) {
      entity = await this.save({ ...entity, ...partialEntity })
    }
    return entity
  }

  /**
   * @description: 新增并保存
   * @param entityLike 
   */
  async createOne(entityLike: DeepPartial<T>) {
    let create = this.create(entityLike);
    let entity = await this.save(create);
    return entity;
  }

  /**
   * @description: 新增多条
   * @param entityLikeArray 
   */
  async createMany(entityLikeArray: DeepPartial<T>[]) {
    let create = this.create(entityLikeArray);
    let entity = await this.save(create);
    return entity;
  }

  /**
   * @description: 新增或更新
   * @param entityLike 
   * @param conflictPathsOrOptions 
   */
  async createOrUpdate(entityLike: DeepPartial<T> & QueryDeepPartialEntity<T>, conflictPathsOrOptions: DeepPartial<keyof T>[]) {
    let conditions = filterByKeys(entityLike, conflictPathsOrOptions)
    let n = await this.count({ where: conditions })
    if (n > 1) {
      throw new Error(`Not the only one entity`)
    }
    let entity = await this.findOneBy(conditions)
    if (!entity) {
      await this.createOne(entityLike)
    } else {
      await this.update(conditions, entityLike)
    }
    entity = await this.findOneBy(conditions)
    return entity
  }

  /**
   * @description: 新增或更新多条
   * @param entityLikes 
   * @param conflictPathsOrOptions 
   */
  async createOrUpdateMany(entityLikes: (DeepPartial<T> & QueryDeepPartialEntity<T>)[], conflictPathsOrOptions: DeepPartial<keyof T>[]) {
    return await asyncPool(entityLikes, async (entityLike) => {
      return await this.createOrUpdate(entityLike, conflictPathsOrOptions)
    })
  }

  /**
   * @description: 查找或插入
   * @param entityLike 
   * @param conflictPathsOrOptions 
   */
  async findOrInsert(entityLike: DeepPartial<T> & QueryDeepPartialEntity<T>, conflictPathsOrOptions: DeepPartial<keyof T>[]) {
    let conditions = filterByKeys(entityLike, conflictPathsOrOptions)
    let n = await this.count({ where: conditions })
    if (n > 1) {
      throw new Error(`Not the only one entity`)
    }
    let entity = await this.findOne({ where: conditions, withDeleted: true })
    if (entity) {
      await this.restore(conditions)
    } else {
      entity = await this.createOne(entityLike)
    }
    return entity
  }

  /**
   * @description: 是否存在记录
   * @param where 
   * @returns 
   */
  async exist(where: FindOptionsWhere<T>) {
    let op = {
      where: where,
    }
    let entity = await this.findOne(op)
    if (entity) {
      return true
    }
    return false
  }

  /**
   * @description: 重写软删除方法
   * @param criteria 
   */
  async softDelete(criteria: FindOptionsWhere<T>): Promise<any> {
    criteria = filterWhere(criteria)
    assert.ok(Object.keys(criteria).length !== 0, new TypeORMError(`Empty criteria(s) are not allowed for the delete method.`))

    const entities = await this.find({ where: criteria })
    const dt = new Date()

    const newEntities = entities.map((it: any) => {
      let entityLike: any = { ...it, deletedId: it.id, deletedAt: dt }
      return entityLike
    })
    const res = await this.save(newEntities)
    return res
  }

  /**
   * @description: 重写恢复方法
   * @param criteria 
   */
  async restore(criteria: FindOptionsWhere<T>): Promise<any> {
    criteria = filterWhere(criteria)
    assert.ok(Object.keys(criteria).length !== 0, new TypeORMError(`Empty criteria(s) are not allowed for the restore method.`))

    const entities = await this.find({ where: criteria, withDeleted: true })

    const newEntities = entities.map((it: any) => {
      let entityLike: any = { ...it, deletedId: null, deletedAt: null }
      return entityLike
    })
    const res = await this.save(newEntities)
    return res
  }

}
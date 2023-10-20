import crypto from "crypto";
import { FindOptionsWhere } from "typeorm";

/**
 * @description: 限制并发数
 * @param {ReadonlyArray} iterable
 * @param {function} iteratorFn
 * @param {number} poolLimit
 */
export async function asyncPool<IN, OUT>(
  iterable: ReadonlyArray<IN>,
  iteratorFn: (generator: IN, iterable: ReadonlyArray<IN>) => OUT,
  poolLimit: number = 20,
) {
  const ret: OUT[] = []
  const executing = new Set()
  for (const item of iterable) {
    const p: any = Promise.resolve().then(() => iteratorFn(item, iterable))
    ret.push(p)
    executing.add(p)
    const clean = () => executing.delete(p)
    p.then(clean).catch(clean)
    if (executing.size >= poolLimit) {
      await Promise.race(executing)
    }
  }
  return Promise.all(ret)
}

export function filterWhere<T>(obj: FindOptionsWhere<T>): FindOptionsWhere<T> {
  Object.keys(obj).forEach(key => {
    if ([undefined, ""].includes(obj[key])) {
      delete obj[key];
    }
  });
  return obj as FindOptionsWhere<T>;
}

/**
 * @description: 传入一个对象和数组, 对象仅保留数组的属性
 * @param obj 
 * @param keys 
 */
export function filterByKeys(obj: any, keys = []) {
  const filtered = {}
  keys.forEach(key => {
    if (!obj.hasOwnProperty(key)) {
      throw new Error(`No hasOwnProperty key: ${key}`)
    } else {
      filtered[key] = obj[key]
    }
  })
  return filtered
}

export function randomString(n: number = 32) {
  const s = crypto.randomBytes(n).toString('hex')
  return s
}

export function md5(s: string) {
  const str = crypto.createHash('md5').update(s).digest("hex")
  return str
}
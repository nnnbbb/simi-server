export const parser = "ts"
import { writeFileSync } from 'fs'
import _ from 'lodash'
import { basename, dirname, join } from 'path'

// console.log = (...args: any) => { }

/**
 * @param file 
 * @param api 
 * 在线预览ast https://astexplorer.net/#/gist/9059e0792b4105c3f954f4a4f74abd4e/9ccf9a8d0bbd498a0ffcd75a0700c1731ee322d6
 */
export default function transformer(file, api) {

  const j = api.jscodeshift
  const root = j(file.source)
  const s = `import { ApiProperty } from "@nestjs/swagger"
import { IsEnum } from "class-validator"`
  root.get().node.program.body.unshift(s)

  const find = root
    .find(j.ExportNamedDeclaration)
    .find(j.ClassDeclaration)  // class name is entity end
    .forEach(it => {
      it.value.superClass = null  // 父类继承
      it.value.decorators = []    // 类装饰器
      it.value.id.name = it.value.id.name + "ResDto" // 类名称
    })
    .find(j.ClassBody)
    .find(j.ClassProperty)
    .filter(p => {
      return p.value.decorators !== undefined   // 一个class属性有多个装饰器, 
    })
    .forEach(p => {
      p.value.decorators = p.value.decorators.filter(it => it.expression.callee.name === 'Column')
      p.value.decorators.forEach(it => {
        it.expression.callee.name = 'ApiProperty'
      })
    })
    .forEach(p => {
      p.value.readonly = true
      p.value.decorators.forEach(it => {
        it.expression.arguments.forEach(it => {

          // 保留 enum和comment
          it.properties = it.properties.filter(it =>
            it.key.name === 'comment' || it.key.name === 'enum' || it.key.name === 'default'
          )

          it.properties.forEach(it => {
            // entity 的 comment 重命名 description
            it.key.name === 'comment' && (it.key.name = 'description')

            // 枚举类型
            if (it.key.name === 'enum') {
              const decorator = _.cloneDeep(p.value.decorators[0])
              decorator.expression.callee.name = "IsEnum"
              decorator.expression.arguments = [j.identifier(it.value.name)]
              p.value.decorators.push(decorator)
            }

          })
        })

      })
    })
  // console.log('find ->', find.length)

  // 删除 import
  root.find(j.ImportDeclaration)
    .forEach(it => {
      j(it).remove()
    })
  // 删除 Repository
  root.find(j.ClassDeclaration)
    .forEach(it => {
      if (it.value.id.name.includes("Repository")) {
        j(it).remove()
      }
    })

  // 过滤掉entity内部的方法定义
  root.find(j.ClassDeclaration)
    .find(j.ClassBody)
    .forEach(it => {
      it.value.body = it.value.body.filter(it => it.type === "ClassProperty")
    })
  const res = root.toSource()
  writeFileSync(dtoPath, res)
  /* eslint-disable  no-console */
  console.log('res ->', res)
}

let dtoPath: string

try {
  const entityFile = process.argv.pop()
  const directory = dirname(entityFile)
  const dtoDirectory = join(directory, '../dto')
  const dtoFilename = basename(entityFile).replace('entity.ts', 'res.dto.ts')
  dtoPath = join(dtoDirectory, dtoFilename)
} catch (err) {
  /* eslint-disable  no-console */
  console.log('err ->', err)

}

import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CustomQuery = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()

  const where = {}
  Object.keys(request.query).map(i => {
    if (i !== 'pageSize' && i !== 'page' && i !== 'sort') {
      where[i] = request.query[i]
    }
  })

  const page = Number(request.query.page)         // skip
  const pageSize = Number(request.query.pageSize) // take

  const query = {
    ...where,
    page: (page - 1) * pageSize || 0,
    pageSize: pageSize || 20,
    sort: request.query.sort || 'DESC',
  }

  return data ? query[data] : query
})

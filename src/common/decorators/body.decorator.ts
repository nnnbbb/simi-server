import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CustomBody = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()

  const where = {}
  Object.keys(request.body).map(i => {
    if (i !== 'pageSize' && i !== 'page' && i !== 'sort') {
      where[i] = request.body[i]
    }
  })

  const page = Number(request.body.page)         // skip
  const pageSize = Number(request.body.pageSize) // take

  const query = {
    ...where,
    page: (page - 1) * pageSize || 0,
    pageSize: pageSize || 20,
    sort: request.body.sort || 'DESC',
  }

  return data ? query[data] : query
})

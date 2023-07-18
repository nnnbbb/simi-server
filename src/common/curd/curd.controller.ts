import { Body, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CurdService } from "./curd.service";
import { Page } from "./page";

export class CurdController<T> {
  constructor(readonly service: CurdService<T>) { }

  @Post()
  async save(@Body() entity: T): Promise<void> {
    await this.service.create(entity);
  }

  @Delete(":id")
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.remove(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(+id, dto);
  }

  @Get()
  async findAll(@Query() query: T & { page: number; pageSize: number }): Promise<Page<T>> {
    return await this.service.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<T | null> {
    return this.service.findOne(+id);
  }


}

import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class BaseDto {
  @ApiProperty({
    description: "id",
  })
  @IsNumber()
  readonly id: number

  @ApiProperty({
    description: "删除id",
  })
  @IsNumber()
  deletedId: number

  @ApiProperty({
    description: "创建时间",
  })
  @IsString()
  readonly createdAt: string

  @ApiProperty({
    description: "更新时间",
  })
  @IsString()
  readonly updatedAt: string

  @ApiProperty({
    description: "删除时间",
  })
  @IsString()
  readonly deletedAt: string

}


import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNumber, IsOptional, Max, Min } from "class-validator"

export class PaginationDto {
  @ApiProperty({
    description: "页码",
    default: 1,
    required: false,
  })
  @Min(0)
  @IsNumber()
  @IsOptional()
  readonly page: number

  @ApiProperty({
    description: "页面大小",
    default: 20,
    required: false,
  })
  @Min(0)
  @Max(50000)
  @IsNumber()
  @IsOptional()
  readonly pageSize: number

  @ApiProperty({
    description: "排序",
    enum: ["ASC", "DESC"],
    default: "DESC",
    required: false,
  })
  @IsEnum(["ASC", "DESC"])
  @IsOptional()
  readonly sort: "ASC" | "DESC"
}


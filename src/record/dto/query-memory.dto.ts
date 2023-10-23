import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class QueryMemoryDto {
  @ApiProperty({
    description: "单词",
    required: false,
  })
  @IsString()
  @IsOptional()
  recordTime: string
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EntityToDto } from "../../common/helper/entity-to-dto.helper";
import { Word } from "../entities/word.entity";

export class CreateWordDto {
  @ApiProperty({
    description: "单词",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  word: string

  @ApiProperty({
    description: "中文意思",
    required: false,
  })
  @IsString()
  @IsOptional()
  chinese: string

  @ApiProperty({
    description: "例句",
  })
  @IsString()
  sentence: string
}


export class WordResDto extends EntityToDto(Word) { }
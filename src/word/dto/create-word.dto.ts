import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { EntityToDto } from "../../common/helper/entity-to-dto.helper";
import { Word } from "../entities/word.entity";

export class CreateWordBookDto {
  @ApiProperty({
    description: "单词",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  word: string
}


export class WordResDto extends EntityToDto(Word) { }
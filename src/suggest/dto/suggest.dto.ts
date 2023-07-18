import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SuggestDto {
  @ApiProperty({
    description: "单词",
  })
  @IsString()
  word: string
}

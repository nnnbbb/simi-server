import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class MemoryDto {
  @ApiProperty({
    description: "单词",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  word: string
}

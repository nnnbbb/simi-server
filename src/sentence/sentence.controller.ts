import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateSentenceDto } from './dto/create-sentence.dto';
import { UpdateSentenceDto } from './dto/update-sentence.dto';
import { SentenceService } from './sentence.service';

@Controller('sentence')
export class SentenceController {
  constructor(private readonly sentenceService: SentenceService) { }

  @Post()
  create(@Body() dto: CreateSentenceDto) {
    return this.sentenceService.create(dto);
  }

  @Get()
  findAll() {
    return this.sentenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sentenceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSentenceDto) {
    return this.sentenceService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sentenceService.remove(+id);
  }
}

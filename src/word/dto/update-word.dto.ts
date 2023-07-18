import { PartialType } from '@nestjs/swagger';
import { CreateWordBookDto } from './create-word.dto';

export class UpdateWordBookDto extends PartialType(CreateWordBookDto) { }

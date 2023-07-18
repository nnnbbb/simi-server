import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('app')
@ApiTags("app")
export class AppController {
  constructor() { }

}

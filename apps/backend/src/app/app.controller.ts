import { Controller, Get } from '@nestjs/common';
import { Message } from '@fullstack-template/interfaces';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData() as Message;
  }
}

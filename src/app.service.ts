import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(
    @Inject('CONFIG')
    private config: { port: string }
  ) { }
  getHello(): string {
    return `Hello World! PORT = ${this.config.port}`;
  }
}

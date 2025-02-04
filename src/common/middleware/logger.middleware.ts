import { Inject, Injectable, Logger, LoggerService, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, url } = req;

    res.on('end', () => {
      const { statusCode } = res;
      this.logger.log(`${method} : ${url} - ${statusCode}`);
    });

    next();
  }
}

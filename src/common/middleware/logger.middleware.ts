import { Injectable, Logger, NestMiddleware } from "@nestjs/common";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  private readonly logger = new Logger();

  use(req: any, res: any, next: (error?: any) => void) {
    const { method, originUrl } = req;
    res.on('end', () => {
      this.logger.log(`${method} : ${originUrl}`)
    })
    next();
  }
}
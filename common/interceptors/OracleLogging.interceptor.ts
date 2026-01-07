import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class OracleLoggingInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before query');

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After query: ${Date.now() - now}ms`)));
  }
}

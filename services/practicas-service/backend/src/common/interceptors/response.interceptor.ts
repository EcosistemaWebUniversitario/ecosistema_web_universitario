import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Serializar a JSON con un replacer que convierte BigInt a Number
        const safeData = JSON.parse(
          JSON.stringify(data, (key, value) =>
            typeof value === 'bigint' ? Number(value) : value,
          ),
        );
        return {
          success: true,
          data: safeData,
        };
      }),
    );
  }
}
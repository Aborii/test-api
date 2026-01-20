import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { HttpCacheInterceptor } from '../interceptors/http-cache.interceptor';

export function UseHttpCacheInterceptor() {
  return applyDecorators(UseInterceptors(HttpCacheInterceptor));
}

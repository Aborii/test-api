import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    const { url, query } = request;

    const queryString = Object.keys(query)
      .sort()
      .map((key) => {
        const value = query[key];
        if (Array.isArray(value)) {
          return `${key}=${(value as string[]).join(',')}`;
        } else if (typeof value === 'object' && value !== null) {
          return `${key}=${JSON.stringify(value)}`;
        } else {
          return `${key}=${value}`;
        }
      })
      .join('&');
    console.log(`customers:${url}${queryString ? '?' + queryString : ''}`);
    return `customers:${url}${queryString ? '?' + queryString : ''}`;
  }
}

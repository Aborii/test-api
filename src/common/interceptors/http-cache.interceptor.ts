import { Cache, CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AppCacheService } from '../global-modules/app-cache/app-cache.service';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManger: Cache,
    reflector: Reflector,
    private readonly appCache: AppCacheService,
  ) {
    super(cacheManger, reflector);
  }
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    const { path, query } = request;

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

    const key = `customers:${path}${queryString ? ':' + queryString : ''}`;
    console.log('🚀 - key:', key);
    this.appCache.track(key);
    return key;
  }
}

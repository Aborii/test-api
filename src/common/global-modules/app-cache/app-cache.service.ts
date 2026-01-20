import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Global, Inject, Injectable } from '@nestjs/common';

@Injectable()
@Global()
export class AppCacheService {
  private readonly keys = new Set<string>();

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  getAllKeys(): string[] {
    return Array.from(this.keys);
  }
  track(key: string) {
    this.keys.add(key);
  }

  async invalidateByPrefix(prefix: string) {
    for (const key of this.keys) {
      if (key.startsWith(prefix)) {
        await this.cache.del(key);
        this.keys.delete(key);
      }
    }
  }
}

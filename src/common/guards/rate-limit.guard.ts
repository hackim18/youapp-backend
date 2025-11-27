import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';

interface Bucket {
  hits: number[];
}

@Injectable()
export class AuthRateLimitGuard implements CanActivate {
  private readonly windowMs = 60_000; // 1 minute
  private readonly maxHits = 5;
  private readonly buckets = new Map<string, Bucket>();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const key: string = request.ip ?? 'global';
    const now = Date.now();

    const bucket = this.buckets.get(key) ?? { hits: [] };
    bucket.hits = bucket.hits.filter((ts) => now - ts < this.windowMs);

    if (bucket.hits.length >= this.maxHits) {
      throw new HttpException('Too many requests. Please try again soon.', HttpStatus.TOO_MANY_REQUESTS);
    }

    bucket.hits.push(now);
    this.buckets.set(key, bucket);

    return true;
  }
}

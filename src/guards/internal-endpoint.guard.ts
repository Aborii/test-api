import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { INTERNAL_ENDPOINT_HEADER } from '../constants';

@Injectable()
export class InternalEndpointGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const internalHeader = request.headers[INTERNAL_ENDPOINT_HEADER];
    return internalHeader === 'true';
  }
}

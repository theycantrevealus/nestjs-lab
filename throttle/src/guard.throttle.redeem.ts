// custom-payload-throttler.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GuardThrottlerRedeem extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (req.method !== 'POST') return true;

    return !(req.body?.keyword && req.body?.msisdn);
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    const keyword = req.body?.keyword;
    const msisdn = req.body?.msisdn;

    if (!keyword || !msisdn) {
      return req.ip;
    }

    return `keyword:${keyword}-msisdn:${msisdn}`;
  }
}

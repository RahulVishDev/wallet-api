import { Redis } from '@upstash/redis'
import {Ratelimit} from "@upstash/ratelimit";
import "dotenv/config";
const RateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter:Ratelimit.slidingWindow(50,"60 s"),
});

export default RateLimiter;

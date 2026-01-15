import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';

// Custom metrics
const success200 = new Counter('http_200_responses');
const throttled429 = new Counter('http_429_responses');
const errorRate = new Rate('error_rate');

export const options = {
  vus: 32,
  duration: '60s',

  thresholds: {
    http_200_responses: ['count>=1'],
    http_429_responses: ['count>0'],
    error_rate: ['rate<0.1'],
  },
};

export default function () {
  const payload = JSON.stringify({
    msisdn: '6285261510202',
    keyword: 'TEREINJECT',
  });

  const res = http.post('http://localhost:3000', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (res.status === 200) success200.add(1);
  if (res.status === 429) throttled429.add(1);

  errorRate.add(res.status >= 400 && res.status !== 429);

  check(res, {
    'status is 200 or 429': (r) => r.status === 200 || r.status === 429,
  });

  sleep(0.2);
}

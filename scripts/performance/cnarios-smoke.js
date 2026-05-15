import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 2,
  duration: '45s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<3000']
  }
};

const baseUrl = __ENV.BASE_URL || 'https://www.cnarios.com';
const routes = [
  '/',
  '/concepts',
  '/concepts/iframe',
  '/concepts/table',
  '/challenges/product-listing-pagination',
  '/challenges/product-filtering',
  '/blogs'
];

export default function () {
  for (const route of routes) {
    const response = http.get(`${baseUrl}${route}`);
    check(response, {
      [`${route} status 200`]: (res) => res.status === 200,
      [`${route} response under 3s`]: (res) => res.timings.duration < 3000
    });
    sleep(0.2);
  }
}

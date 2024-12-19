// rateLimiter.test.js
const httpMocks = require('node-mocks-http');
const { authLimiter } = require('../../../src/middlewares/rateLimiter');

describe('Rate Limiter Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/auth',
      headers: {},
    });
    res = httpMocks.createResponse();
    next = jest.fn();
    req.ip = '127.0.0.1'; // Mock IP address for tracking by rate limiter
  });

  test('should allow requests under the rate limit', async () => {
    for (let i = 0; i < 20; i++) {
      res = httpMocks.createResponse(); // Reset response for each request
      await authLimiter(req, res, next);

      // Check that the response status is not 429 (rate-limited) for requests within the limit
      expect(res.statusCode).not.toBe(429);
    }
  });

  test('should block requests over the rate limit', async () => {
    for (let i = 0; i < 20; i++) {
      await authLimiter(req, res, next);
      next.mockClear(); // Clear mock to prepare for the next iteration
    }
    await authLimiter(req, res, next); // This should be the 21st request

    expect(next).not.toHaveBeenCalled(); // Should not call next as it hits the limit
    expect(res.statusCode).toBe(429); // Should block at 21st request with status 429
    expect(res._getData()).toContain('Too many requests'); // Check for expected error message
  });
});

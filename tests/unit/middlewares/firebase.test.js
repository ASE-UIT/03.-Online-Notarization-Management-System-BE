// firebase.test.js
const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const ApiError = require('../../../src/utils/ApiError');
const firebaseAuth = require('../../../src/middlewares/firebase.js'); // Đường dẫn đầy đủ với .js
const { app } = require('../../../src/config/firebase.js'); // Đường dẫn đầy đủ với .js

// Mock toàn bộ module firebase.js
jest.mock('../../../src/config/firebase.js', () => ({
  app: {
    auth: jest.fn(),
  },
}));

describe('Firebase Auth Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      headers: {
        authorization: 'Bearer validToken123',
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call next() if token is valid', async () => {
    // Mock app.auth().verifyIdToken để trả về một token hợp lệ
    app.auth.mockReturnValue({
      verifyIdToken: jest.fn().mockResolvedValue({ uid: 'user123', name: 'Test User' }),
    });

    await firebaseAuth(req, res, next);

    expect(req.user).toEqual({ uid: 'user123', name: 'Test User' });
    expect(next).toHaveBeenCalled();
  });

  test('should return UNAUTHORIZED error if token is missing', async () => {
    req = httpMocks.createRequest(); // Không có header authorization

    await firebaseAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(next.mock.calls[0][0].message).toBe('Invalid authentication token');
  });

  test('should return UNAUTHORIZED error if token is invalid', async () => {
    // Mock app.auth().verifyIdToken để ném lỗi khi token không hợp lệ
    app.auth.mockReturnValue({
      verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid token')),
    });

    await firebaseAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].statusCode).toBe(httpStatus.UNAUTHORIZED);
    expect(next.mock.calls[0][0].message).toBe('Invalid authentication token');
  });
});

// auth.test.js
const passport = require('passport');
const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const ApiError = require('../../../src/utils/ApiError');
const auth = require('../../../src/middlewares/auth'); // Đường dẫn đến middleware auth
const { getPermissionsByRoleName } = require('../../../src/config/roles'); // Đường dẫn đến file roles

jest.mock('passport');
jest.mock('../../../src/config/roles');

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should allow access if user is authenticated and has required rights', async () => {
    // Mock passport.authenticate để mô phỏng người dùng đã xác thực
    passport.authenticate.mockImplementation((strategy, options, callback) => (req, res, next) => {
      callback(null, { id: 'user123', role: 'admin' });
    });

    // Mock getPermissionsByRoleName để cung cấp quyền truy cập yêu cầu
    getPermissionsByRoleName.mockResolvedValue(['READ', 'WRITE']);

    await auth('READ')(req, res, next);

    expect(next).toHaveBeenCalled(); // Kiểm tra `next` được gọi khi người dùng có quyền truy cập
  });

  test('should return UNAUTHORIZED if user is not authenticated', async () => {
    passport.authenticate.mockImplementation((strategy, options, callback) => (req, res, next) => {
      callback(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'), null);
    });

    await auth()(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  test('should return FORBIDDEN if user does not have required rights', async () => {
    passport.authenticate.mockImplementation((strategy, options, callback) => (req, res, next) => {
      callback(null, { id: 'user123', role: 'user' });
    });

    getPermissionsByRoleName.mockResolvedValue(['READ']); // Mock chỉ có quyền READ

    await auth('WRITE')(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next.mock.calls[0][0].statusCode).toBe(httpStatus.FORBIDDEN);
  });
});

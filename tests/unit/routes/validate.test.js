// validate.test.js
const httpMocks = require('node-mocks-http');
const Joi = require('joi');
const httpStatus = require('http-status');
const ApiError = require('../../../src/utils/ApiError');
const validate = require('../../../src/middlewares/validate');

describe('Validate Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  test('should call next with validated data if validation passes', () => {
    const schema = {
      body: Joi.object({
        name: Joi.string().required(),
        age: Joi.number().integer().min(0),
      }),
    };
    req.body = { name: 'John', age: 25 };

    validate(schema)(req, res, next);

    // Check that `next` is called without errors
    expect(next).toHaveBeenCalledWith();
    // Check that `req.body` contains the validated data
    expect(req.body).toEqual({ name: 'John', age: 25 });
  });

  test('should call next with an error if validation fails', () => {
    const schema = {
      body: Joi.object({
        name: Joi.string().required(),
        age: Joi.number().integer().min(0),
      }),
    };
    req.body = { age: -5 }; // Missing 'name' and invalid 'age'

    validate(schema)(req, res, next);

    // Check that `next` is called with an ApiError
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    // Check that the error contains the correct status and message
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(httpStatus.BAD_REQUEST);
    expect(error.message).toContain('"name" is required');
    expect(error.message).toContain('"age" must be greater than or equal to 0');
  });

  test('should validate query parameters', () => {
    const schema = {
      query: Joi.object({
        search: Joi.string().required(),
      }),
    };
    req.query = { search: 'test' };

    validate(schema)(req, res, next);

    // Check that `next` is called without errors
    expect(next).toHaveBeenCalledWith();
    // Check that `req.query` contains the validated data
    expect(req.query).toEqual({ search: 'test' });
  });

  test('should call next with an error if query validation fails', () => {
    const schema = {
      query: Joi.object({
        search: Joi.string().required(),
      }),
    };
    req.query = {}; // Missing 'search'

    validate(schema)(req, res, next);

    // Check that `next` is called with an ApiError
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(httpStatus.BAD_REQUEST);
    expect(error.message).toContain('"search" is required');
  });
});

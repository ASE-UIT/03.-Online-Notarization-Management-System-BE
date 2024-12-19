// parseJson.test.js
const httpMocks = require('node-mocks-http');
const parseJson = require('../../../src/middlewares/parseJson'); // Đường dẫn đầy đủ đến parseJson.js

describe('Parse JSON Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  test('should parse JSON fields correctly if JSON is valid', () => {
    req.body = {
      notarizationService: JSON.stringify({ type: 'ServiceType', cost: 100 }),
      notarizationField: JSON.stringify({ field: 'FieldData' }),
      requesterInfo: JSON.stringify({ name: 'John Doe', age: 30 }),
    };

    parseJson(req, res, next);

    expect(req.body.notarizationService).toEqual({ type: 'ServiceType', cost: 100 });
    expect(req.body.notarizationField).toEqual({ field: 'FieldData' });
    expect(req.body.requesterInfo).toEqual({ name: 'John Doe', age: 30 });
    expect(next).toHaveBeenCalled();
  });

  test('should return 400 error if notarizationService is invalid JSON', () => {
    req.body = {
      notarizationService: "{ type: 'ServiceType', cost: 100 }", // Invalid JSON
    };

    parseJson(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Invalid JSON input' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 400 error if notarizationField is invalid JSON', () => {
    req.body = {
      notarizationField: "{ field: 'FieldData' }", // Invalid JSON
    };

    parseJson(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Invalid JSON input' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 400 error if requesterInfo is invalid JSON', () => {
    req.body = {
      requesterInfo: "{ name: 'John Doe', age: 30 }", // Invalid JSON
    };

    parseJson(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Invalid JSON input' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should call next() if all fields are missing', () => {
    parseJson(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

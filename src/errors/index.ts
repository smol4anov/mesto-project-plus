import { Request, Response, NextFunction } from 'express';

const http2 = require('node:http2');

const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = http2.constants;

interface IError extends Error {
  statusCode: number;
}

class ModifiedError extends Error {
  statusCode: number;

  constructor(message: string, status: number) {
    super(message);
    this.statusCode = status;
  }
}

const handleErrors = (
  err: Error | IError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { message } = err;
  const statusCode = 'statusCode' in err ? err.statusCode : HTTP_STATUS_INTERNAL_SERVER_ERROR;
  res.status(statusCode).send({
    message: statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : message,
  });
  next();
};

export { ModifiedError, handleErrors };

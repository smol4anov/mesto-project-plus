import { Request, Response, NextFunction } from 'express';

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
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
};

export { ModifiedError, handleErrors };

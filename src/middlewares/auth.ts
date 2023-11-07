import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import http2 from 'node:http2';
import { ObjectId } from 'mongoose';
import { ModifiedError } from '../errors';

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;
const { HTTP_STATUS_UNAUTHORIZED } = http2.constants;

type payloadType = { _id: ObjectId | string};

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req?.cookies?.jwt;

  if (!token) {
    return next(new ModifiedError('Необходима авторизация', HTTP_STATUS_UNAUTHORIZED));
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    return next(new ModifiedError('Необходима авторизация', HTTP_STATUS_UNAUTHORIZED));
  }

  req.user = payload as payloadType;
  return next();
};

export default auth;

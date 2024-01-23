import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';

const { ALLOWED_HTTP_CORS, ALLOWED_HTTPS_CORS } = process.env;

const DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';

export const cors = (req: Request, res: Response, next: NextFunction) => {
  const { origin } = req.headers;
  const { method } = req;
  if (
    typeof origin === 'string' &&
    (ALLOWED_HTTP_CORS === origin || ALLOWED_HTTPS_CORS === origin)
  ) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};

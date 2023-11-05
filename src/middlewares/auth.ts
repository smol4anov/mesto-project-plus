import { Request, Response, NextFunction } from 'express';

const auth = (req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '654633ef0f51e8233e162671',
  };

  next();
};

export default auth;

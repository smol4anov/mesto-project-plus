import { Router } from 'express';
import userRouter from './users';
import cardRouter from './cards';
import auth from '../middlewares/auth';
import { ModifiedError } from '../errors';

const http2 = require('node:http2');

const { HTTP_STATUS_NOT_FOUND } = http2.constants;

const router = Router();

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', () => {
  throw new ModifiedError('Запрашиваемый ресурс не найден', HTTP_STATUS_NOT_FOUND);
});

export default router;

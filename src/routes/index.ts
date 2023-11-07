import { Router } from 'express';
import http2 from 'node:http2';
import { celebrate, Joi } from 'celebrate';
import userRouter from './users';
import cardRouter from './cards';
import auth from '../middlewares/auth';
import { ModifiedError } from '../errors';
import { createUser, login } from '../controllers/users';
import { rexExpUrl } from '../utils/constants';

const { HTTP_STATUS_NOT_FOUND } = http2.constants;

const router = Router();

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(rexExpUrl),
  }),
}), createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', () => {
  throw new ModifiedError('Запрашиваемый ресурс не найден', HTTP_STATUS_NOT_FOUND);
});

export default router;

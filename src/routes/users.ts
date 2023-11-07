import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { rexExpUrl } from '../utils/constants';
import {
  getSelfUser,
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserById,
} from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/me', getSelfUser);

userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(20),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateUserById);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(rexExpUrl),
  }),
}), updateUserAvatar);

export default userRouter;

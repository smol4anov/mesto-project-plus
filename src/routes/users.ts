import { Router } from 'express';

import {
  createUser,
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserById,
} from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUserById);
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;

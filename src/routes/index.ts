import { Router } from 'express';
import userRouter from './users';
import cardRouter from './cards';
import auth from '../middlewares/auth';

const router = Router();

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

export default router;

import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import { ModifiedError } from '../errors';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });
    return res.status(201).send({ data: user });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ModifiedError('Переданы некорректные данные', 400));
    }
    return next(err);
  }
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.status(200).send({ data: users });
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId)
      .orFail(new ModifiedError('Запрашиваемый пользователь не найден', 404));
    return res.status(200).send({ data: user });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new ModifiedError('Некорректный формат id', 400));
    }
    return next(err);
  }
};

const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true },
    ).orFail(new ModifiedError('Запрашиваемый пользователь не найден', 404));
    return res.status(200).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new ModifiedError('Некорректный формат id', 400));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ModifiedError('Переданы некорректные данные', 400));
    }
    return next(err);
  }
};

const updateUserAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true },
    ).orFail(new ModifiedError('Запрашиваемый пользователь не найден', 404));
    return res.status(200).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new ModifiedError('Некорректный формат id', 400));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ModifiedError('Переданы некорректные данные', 400));
    }
    return next(err);
  }
};

export {
  createUser, getUsers, getUserById, updateUserById, updateUserAvatar,
};

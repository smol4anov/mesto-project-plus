import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import http2 from 'node:http2';
import User from '../models/user';
import { ModifiedError } from '../errors';

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
} = http2.constants;

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });
    return res.status(HTTP_STATUS_CREATED).send({ data: user });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ModifiedError('Переданы некорректные данные', HTTP_STATUS_BAD_REQUEST));
    }
    return next(err);
  }
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.status(HTTP_STATUS_OK).send({ data: users });
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId)
      .orFail(new ModifiedError('Запрашиваемый пользователь не найден', HTTP_STATUS_NOT_FOUND));
    return res.status(HTTP_STATUS_OK).send({ data: user });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new ModifiedError('Некорректный формат id', HTTP_STATUS_BAD_REQUEST));
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
      {
        new: true,
        runValidators: true,
      },
    ).orFail(new ModifiedError('Запрашиваемый пользователь не найден', HTTP_STATUS_NOT_FOUND));
    return res.status(HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ModifiedError('Переданы некорректные данные', HTTP_STATUS_BAD_REQUEST));
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
      {
        new: true,
        runValidators: true,
      },
    ).orFail(new ModifiedError('Запрашиваемый пользователь не найден', HTTP_STATUS_NOT_FOUND));
    return res.status(HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ModifiedError('Переданы некорректные данные', HTTP_STATUS_BAD_REQUEST));
    }
    return next(err);
  }
};

export {
  createUser, getUsers, getUserById, updateUserById, updateUserAvatar,
};

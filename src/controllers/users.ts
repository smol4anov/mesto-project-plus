import { NextFunction, Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import http2 from 'node:http2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { ModifiedError } from '../errors';

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_CONFLICT,
} = http2.constants;

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      ...req.body,
      password: hash,
    });

    const newUser = {
      email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    };

    return res.status(HTTP_STATUS_CREATED).send({ data: newUser });
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      return next(
        new ModifiedError(
          'Пользователь уже зарегистрирован',
          HTTP_STATUS_CONFLICT
        )
      );
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(
        new ModifiedError(
          'Переданы некорректные данные',
          HTTP_STATUS_BAD_REQUEST
        )
      );
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
    const user = await User.findById(req.params.userId).orFail(
      new ModifiedError(
        'Запрашиваемый пользователь не найден',
        HTTP_STATUS_NOT_FOUND
      )
    );
    return res.status(HTTP_STATUS_OK).send({ data: user });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(
        new ModifiedError('Некорректный формат id', HTTP_STATUS_BAD_REQUEST)
      );
    }
    return next(err);
  }
};

const updateUserData = async (
  UserData: Object,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, UserData, {
      new: true,
      runValidators: true,
    }).orFail(
      new ModifiedError(
        'Запрашиваемый пользователь не найден',
        HTTP_STATUS_NOT_FOUND
      )
    );
    return res.status(HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(
        new ModifiedError(
          'Переданы некорректные данные',
          HTTP_STATUS_BAD_REQUEST
        )
      );
    }
    return next(err);
  }
};

const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, about } = req.body;

  return updateUserData({ name, about }, req, res, next);
};

const updateUserAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { avatar } = req.body;

  return updateUserData({ avatar }, req, res, next);
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' }
    );
    return res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
      .status(HTTP_STATUS_OK)
      .send({ token });
  } catch (err) {
    return next(err);
  }
};

const getSelfUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id).orFail(
      new ModifiedError(
        'Запрашиваемый пользователь не найден',
        HTTP_STATUS_NOT_FOUND
      )
    );
    return res.status(HTTP_STATUS_OK).send(user);
  } catch (err) {
    return next(err);
  }
};

export {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatar,
  login,
  getSelfUser,
};

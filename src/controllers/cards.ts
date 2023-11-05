import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { ModifiedError } from '../errors';

const createCard = async (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    const newCard = await card.populate('owner');
    return res.status(201).send({ data: newCard });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ModifiedError('Переданы некорректные данные', 400));
    }
    return next(err);
  }
};

const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.send({ data: cards });
  } catch (err) {
    return next(err);
  }
};

const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Card.findByIdAndDelete(req.params.cardId)
      .orFail(new ModifiedError('Карточка не найдена по id', 404));
    return res.status(200).send({ message: 'Card has been deleted' });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new ModifiedError('Некорректный формат id', 400));
    }
    return next(err);
  }
};

const setCardLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(new ModifiedError('Карточка не найдена по id', 404));
    card = await card.populate(['owner', 'likes']);
    return res.status(200).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new ModifiedError('Некорректный формат id', 400));
    }
    return next(err);
  }
};

const removeCardLike = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail(new ModifiedError('Карточка не найдена по id', 404));
    card = await card.populate(['owner', 'likes']);
    return res.status(200).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new ModifiedError('Некорректный формат id', 400));
    }
    return next(err);
  }
};

export {
  createCard, getCards, deleteCard, setCardLike, removeCardLike,
};

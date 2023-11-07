import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { rexExpUrl } from '../utils/constants';
import {
  createCard,
  deleteCard,
  getCards,
  removeCardLike,
  setCardLike,
} from '../controllers/cards';

const cardRouter = Router();

const checkParams = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});

cardRouter.get('/', getCards);

cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(rexExpUrl),
  }),
}), createCard);

cardRouter.delete('/:cardId', checkParams, deleteCard);

cardRouter.put('/:cardId/likes', checkParams, setCardLike);

cardRouter.delete('/:cardId/likes', checkParams, removeCardLike);

export default cardRouter;

import { Router } from 'express';
import {
  createCard,
  deleteCard,
  getCards,
  removeCardLike,
  setCardLike,
} from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', setCardLike);
cardRouter.delete('/:cardId/likes', removeCardLike);

export default cardRouter;

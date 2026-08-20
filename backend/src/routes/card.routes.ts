import { Router } from 'express';
import * as cardController from '../controllers/card.controller';
import { validateBody } from '../middlewares/validate';
import {
  createCardSchema,
  reorderCardsSchema,
  updateCardSchema,
} from '../validators/card.validator';

const router = Router({ mergeParams: true });

router.post('/', validateBody(createCardSchema), cardController.createCard);
router.patch('/reorder', validateBody(reorderCardsSchema), cardController.reorderCards);
router.patch('/:cardId', validateBody(updateCardSchema), cardController.updateCard);
router.delete('/:cardId', cardController.deleteCard);

export default router;

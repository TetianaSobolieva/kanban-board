import { Router } from 'express';
import * as boardController from '../controllers/board.controller';
import { validateBody } from '../middlewares/validate';
import { createBoardSchema, updateBoardSchema } from '../validators/board.validator';
import cardRoutes from './card.routes';

const router = Router();

router.post('/', validateBody(createBoardSchema), boardController.createBoard);
router.get('/:boardId', boardController.getBoard);
router.patch('/:boardId', validateBody(updateBoardSchema), boardController.updateBoard);
router.delete('/:boardId', boardController.deleteBoard);

router.use('/:boardId/cards', cardRoutes);

export default router;

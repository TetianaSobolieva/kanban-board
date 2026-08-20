import { Request, Response, NextFunction } from 'express';
import * as cardService from '../services/card.service';

export async function createCard(req: Request, res: Response, next: NextFunction) {
  try {
    const card = await cardService.createCard(req.params.boardId, req.body);
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
}

export async function updateCard(req: Request, res: Response, next: NextFunction) {
  try {
    const card = await cardService.updateCard(req.params.boardId, req.params.cardId, req.body);
    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
}

export async function deleteCard(req: Request, res: Response, next: NextFunction) {
  try {
    await cardService.deleteCard(req.params.boardId, req.params.cardId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function reorderCards(req: Request, res: Response, next: NextFunction) {
  try {
    await cardService.reorderCards(req.params.boardId, req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
}

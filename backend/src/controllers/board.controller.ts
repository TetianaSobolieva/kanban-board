import { Request, Response, NextFunction } from 'express';
import * as boardService from '../services/board.service';

export async function createBoard(req: Request, res: Response, next: NextFunction) {
  try {
    const board = await boardService.createBoard(req.body);
    res.status(201).json(board);
  } catch (err) {
    next(err);
  }
}

export async function getBoard(req: Request, res: Response, next: NextFunction) {
  try {
    const board = await boardService.getBoardById(req.params.boardId);
    res.status(200).json(board);
  } catch (err) {
    next(err);
  }
}

export async function updateBoard(req: Request, res: Response, next: NextFunction) {
  try {
    const board = await boardService.updateBoard(req.params.boardId, req.body);
    res.status(200).json(board);
  } catch (err) {
    next(err);
  }
}

export async function deleteBoard(req: Request, res: Response, next: NextFunction) {
  try {
    await boardService.deleteBoard(req.params.boardId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

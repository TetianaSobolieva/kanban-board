import { nanoid } from 'nanoid';
import { AppDataSource } from '../data-source';
import { Board } from '../entities/Board';
import { Card } from '../entities/Card';
import { ColumnType, COLUMN_ORDER } from '../entities/ColumnType';
import { NotFoundError } from '../utils/AppError';
import { CreateBoardInput, UpdateBoardInput } from '../validator/board.validator';

const boardRepo = () => AppDataSource.getRepository(Board);
const cardRepo = () => AppDataSource.getRepository(Card);

export interface BoardWithColumns {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  columns: Record<ColumnType, Card[]>;
}

async function toBoardWithColumns(board: Board): Promise<BoardWithColumns> {
  const cards = await cardRepo().find({
    where: { boardId: board.id },
    order: { order: 'ASC' },
  });

  const columns = COLUMN_ORDER.reduce(
    (acc, col) => {
      acc[col] = cards.filter((c) => c.column === col);
      return acc;
    },
    {} as Record<ColumnType, Card[]>,
  );

  return {
    id: board.id,
    name: board.name,
    createdAt: board.createdAt,
    updatedAt: board.updatedAt,
    columns,
  };
}

export async function createBoard(input: CreateBoardInput): Promise<BoardWithColumns> {
  const board = boardRepo().create({ id: nanoid(10), name: input.name });
  await boardRepo().save(board);
  return toBoardWithColumns(board);
}

export async function getBoardById(id: string): Promise<BoardWithColumns> {
  const board = await boardRepo().findOne({ where: { id } });
  if (!board) throw new NotFoundError('Board not found');
  return toBoardWithColumns(board);
}

export async function updateBoard(id: string, input: UpdateBoardInput): Promise<BoardWithColumns> {
  const board = await boardRepo().findOne({ where: { id } });
  if (!board) throw new NotFoundError('Board not found');
  board.name = input.name;
  await boardRepo().save(board);
  return toBoardWithColumns(board);
}

export async function deleteBoard(id: string): Promise<void> {
  const result = await boardRepo().delete({ id });
  if (!result.affected) throw new NotFoundError('Board not found');
}

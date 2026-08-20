import { AppDataSource } from '../data-source';
import { Board } from '../entities/Board';
import { Card } from '../entities/Card';
import { NotFoundError } from '../utils/AppError';
import { CreateCardInput, ReorderCardsInput, UpdateCardInput } from '../validator/card.validator';

const cardRepo = () => AppDataSource.getRepository(Card);
const boardRepo = () => AppDataSource.getRepository(Board);

async function assertBoardExists(boardId: string): Promise<void> {
  const exists = await boardRepo().exist({ where: { id: boardId } });
  if (!exists) throw new NotFoundError('Board not found');
}

export async function createCard(boardId: string, input: CreateCardInput): Promise<Card> {
  await assertBoardExists(boardId);

  const maxOrderResult = await cardRepo()
    .createQueryBuilder('card')
    .select('MAX(card.order)', 'max')
    .where('card.boardId = :boardId AND card.column = :column', {
      boardId,
      column: input.column,
    })
    .getRawOne<{ max: number | null }>();

  const nextOrder = (maxOrderResult?.max ?? -1) + 1;

  const card = cardRepo().create({
    boardId,
    title: input.title,
    description: input.description,
    column: input.column,
    order: nextOrder,
  });

  return cardRepo().save(card);
}

export async function updateCard(
  boardId: string,
  cardId: string,
  input: UpdateCardInput,
): Promise<Card> {
  const card = await cardRepo().findOne({ where: { id: cardId, boardId } });
  if (!card) throw new NotFoundError('Card not found');

  Object.assign(card, input);
  return cardRepo().save(card);
}

export async function deleteCard(boardId: string, cardId: string): Promise<void> {
  const result = await cardRepo().delete({ id: cardId, boardId });
  if (!result.affected) throw new NotFoundError('Card not found');
}

export async function reorderCards(boardId: string, input: ReorderCardsInput): Promise<void> {
  await assertBoardExists(boardId);

  await AppDataSource.transaction(async (manager) => {
    for (const item of input.cards) {
      await manager.update(
        Card,
        { id: item.id, boardId },
        { column: item.column, order: item.order },
      );
    }
  });
}

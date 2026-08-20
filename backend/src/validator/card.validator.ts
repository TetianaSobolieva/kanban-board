import { z } from 'zod';
import { ColumnType } from '../entities/ColumnType';

export const createCardSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().max(5000).optional().default(''),
  column: z.nativeEnum(ColumnType).optional().default(ColumnType.TODO),
});

export const updateCardSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(5000).optional(),
  column: z.nativeEnum(ColumnType).optional(),
  order: z.number().int().min(0).optional(),
});

export const reorderCardsSchema = z.object({
  cards: z
    .array(
      z.object({
        id: z.string().uuid(),
        column: z.nativeEnum(ColumnType),
        order: z.number().int().min(0),
      }),
    )
    .min(1),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type ReorderCardsInput = z.infer<typeof reorderCardsSchema>;

import { z } from 'zod';

export const createBoardSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
});

export const updateBoardSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;

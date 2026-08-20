export enum ColumnType {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export const COLUMN_ORDER: ColumnType[] = [
  ColumnType.TODO,
  ColumnType.IN_PROGRESS,
  ColumnType.DONE,
];

export const COLUMN_TITLES: Record<ColumnType, string> = {
  [ColumnType.TODO]: 'To Do',
  [ColumnType.IN_PROGRESS]: 'In Progress',
  [ColumnType.DONE]: 'Done',
};

export interface Card {
  id: string;
  boardId: string;
  title: string;
  description: string;
  column: ColumnType;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  columns: Record<ColumnType, Card[]>;
}

export interface CreateCardPayload {
  title: string;
  description?: string;
  column?: ColumnType;
}

export interface UpdateCardPayload {
  title?: string;
  description?: string;
  column?: ColumnType;
  order?: number;
}

export interface ReorderItem {
  id: string;
  column: ColumnType;
  order: number;
}

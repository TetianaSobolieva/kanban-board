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

import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useAppDispatch } from '../app/hooks';
import {
  apiSlice,
  useCreateCardMutation,
  useDeleteBoardMutation,
  useDeleteCardMutation,
  useGetBoardQuery,
  useReorderCardsMutation,
  useUpdateBoardMutation,
  useUpdateCardMutation,
} from '../api/apiSlice';
import { Card, ColumnType, COLUMN_ORDER, ReorderItem } from '../types';
import BoardHeader from '../components/BoardHeader';
import Column from '../components/Column';
import CardModal from '../components/CardModal';
import styles from './BoardPage.module.css';

type ModalState = { mode: 'create'; column: ColumnType } | { mode: 'edit'; card: Card } | null;

export default function BoardPage() {
  const { boardId = '' } = useParams();
  const dispatch = useAppDispatch();
  const [modal, setModal] = useState<ModalState>(null);

  const { data: board, isLoading, isError } = useGetBoardQuery(boardId, { skip: !boardId });
  const [updateBoard] = useUpdateBoardMutation();
  const [deleteBoard] = useDeleteBoardMutation();
  const [createCard] = useCreateCardMutation();
  const [updateCard] = useUpdateCardMutation();
  const [deleteCard] = useDeleteCardMutation();
  const [reorderCards] = useReorderCardsMutation();

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!board || !destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
      }

      const sourceCol = source.droppableId as ColumnType;
      const destCol = destination.droppableId as ColumnType;

      const newColumns: Record<ColumnType, Card[]> = {
        [ColumnType.TODO]: board.columns[ColumnType.TODO].map((c) => ({ ...c })),
        [ColumnType.IN_PROGRESS]: board.columns[ColumnType.IN_PROGRESS].map((c) => ({ ...c })),
        [ColumnType.DONE]: board.columns[ColumnType.DONE].map((c) => ({ ...c })),
      };

      const sourceList = newColumns[sourceCol];
      const movedIndex = sourceList.findIndex((c) => c.id === draggableId);
      if (movedIndex === -1) return;
      const [moved] = sourceList.splice(movedIndex, 1);
      moved.column = destCol;
      newColumns[destCol].splice(destination.index, 0, moved);

      const affectedColumns = Array.from(new Set([sourceCol, destCol]));
      const changed: ReorderItem[] = [];
      affectedColumns.forEach((col) => {
        newColumns[col].forEach((c, i) => {
          c.order = i;
          changed.push({ id: c.id, column: col, order: i });
        });
      });

      dispatch(
        apiSlice.util.updateQueryData('getBoard', boardId, (draft) => {
          draft.columns = newColumns;
        }),
      );

      reorderCards({ boardId, cards: changed }).catch(() => {
      });
    },
    [board, boardId, dispatch, reorderCards],
  );

  if (!boardId) return null;

  if (isLoading) {
    return (
      <div className={styles.state}>
        <p className={styles.stateText}>Loading board…</p>
      </div>
    );
  }

  if (isError || !board) {
    return (
      <div className={styles.state}>
        <h2 className={styles.stateTitle}>Board not found</h2>
        <p className={styles.stateText}>
          We couldn't find a board with ID "{boardId}". Double-check the ID or create a new board.
        </p>
        <a className="btn btn-accent" href="/">
          Back to home
        </a>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <BoardHeader
        boardId={board.id}
        name={board.name}
        onRename={(name) => updateBoard({ boardId, name })}
        onDelete={() => {
          deleteBoard(boardId);
          window.location.href = '/';
        }}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.board}>
          {COLUMN_ORDER.map((col) => (
            <Column
              key={col}
              column={col}
              cards={board.columns[col]}
              onOpenCard={(card) => setModal({ mode: 'edit', card })}
              onAddCard={(column) => setModal({ mode: 'create', column })}
            />
          ))}
        </div>
      </DragDropContext>

      {modal?.mode === 'create' && (
        <CardModal
          mode="create"
          initialColumn={modal.column}
          onClose={() => setModal(null)}
          onSave={(data) => {
            createCard({ boardId, payload: data });
            setModal(null);
          }}
        />
      )}

      {modal?.mode === 'edit' && (
        <CardModal
          mode="edit"
          initialColumn={modal.card.column}
          card={modal.card}
          onClose={() => setModal(null)}
          onSave={(data) => {
            updateCard({ boardId, cardId: modal.card.id, payload: data });
            setModal(null);
          }}
          onDelete={() => {
            deleteCard({ boardId, cardId: modal.card.id });
            setModal(null);
          }}
        />
      )}
    </div>
  );
}

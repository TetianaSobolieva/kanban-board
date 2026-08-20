import { Draggable } from '@hello-pangea/dnd';
import { Card, ColumnType } from '../types';
import styles from './CardItem.module.css';

const ACCENT: Record<ColumnType, string> = {
  [ColumnType.TODO]: 'var(--color-todo)',
  [ColumnType.IN_PROGRESS]: 'var(--color-progress)',
  [ColumnType.DONE]: 'var(--color-done)',
};

interface Props {
  card: Card;
  index: number;
  onOpen: () => void;
}

export default function CardItem({ card, index, onOpen }: Props) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.card} ${snapshot.isDragging ? styles.dragging : ''}`}
          style={{ ...provided.draggableProps.style, ['--accent' as string]: ACCENT[card.column] }}
          onClick={onOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onOpen();
          }}
        >
          <p className={styles.title}>{card.title}</p>
          {card.description && <p className={styles.desc}>{card.description}</p>}
        </div>
      )}
    </Draggable>
  );
}

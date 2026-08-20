import { Droppable } from '@hello-pangea/dnd';
import { Card, ColumnType, COLUMN_TITLES } from '../types';
import CardItem from './CardItem';
import styles from './Column.module.css';

const DOT_COLOR: Record<ColumnType, string> = {
  [ColumnType.TODO]: 'var(--color-todo)',
  [ColumnType.IN_PROGRESS]: 'var(--color-progress)',
  [ColumnType.DONE]: 'var(--color-done)',
};

interface Props {
  column: ColumnType;
  cards: Card[];
  onOpenCard: (card: Card) => void;
  onAddCard: (column: ColumnType) => void;
}

export default function Column({ column, cards, onOpenCard, onAddCard }: Props) {
  return (
    <div className={styles.column}>
      <div className={styles.head}>
        <div className={styles.headLeft}>
          <span className={styles.dot} style={{ background: DOT_COLOR[column] }} />
          <span className={styles.title}>{COLUMN_TITLES[column]}</span>
        </div>
        <span className={styles.count}>{cards.length}</span>
      </div>

      <Droppable droppableId={column}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${styles.list} ${snapshot.isDraggingOver ? styles.listDraggingOver : ''}`}
          >
            {cards.length === 0 && !snapshot.isDraggingOver && (
              <div className={styles.empty}>No cards yet</div>
            )}
            {cards.map((card, index) => (
              <CardItem key={card.id} card={card} index={index} onOpen={() => onOpenCard(card)} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button className={styles.addBtn} onClick={() => onAddCard(column)}>
        + Add a card
      </button>
    </div>
  );
}

import { FormEvent, useState } from 'react';
import { Card, ColumnType, COLUMN_ORDER, COLUMN_TITLES } from '../types';
import styles from './CardModal.module.css';

interface Props {
  mode: 'create' | 'edit';
  initialColumn: ColumnType;
  card?: Card;
  onClose: () => void;
  onSave: (data: { title: string; description: string; column: ColumnType }) => void;
  onDelete?: () => void;
}

export default function CardModal({ mode, initialColumn, card, onClose, onSave, onDelete }: Props) {
  const [title, setTitle] = useState(card?.title ?? '');
  const [description, setDescription] = useState(card?.description ?? '');
  const [column, setColumn] = useState<ColumnType>(card?.column ?? initialColumn);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Title is required.');
      return;
    }
    onSave({ title: trimmed, description: description.trim(), column });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHead}>
          <h2 className={styles.modalTitle}>{mode === 'create' ? 'New card' : 'Edit card'}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="card-title">
              Title
            </label>
            <input
              id="card-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              maxLength={200}
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="card-desc">
              Description
            </label>
            <textarea
              id="card-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={5000}
              placeholder="Add more detail (optional)"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="card-column">
              Column
            </label>
            <select
              id="card-column"
              className={styles.select}
              value={column}
              onChange={(e) => setColumn(e.target.value as ColumnType)}
            >
              {COLUMN_ORDER.map((c) => (
                <option key={c} value={c}>
                  {COLUMN_TITLES[c]}
                </option>
              ))}
            </select>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.footer}>
            <div>
              {mode === 'edit' && onDelete && (
                <button type="button" className="btn btn-danger" onClick={onDelete}>
                  Delete card
                </button>
              )}
            </div>
            <div className={styles.footerRight}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-accent">
                {mode === 'create' ? 'Create card' : 'Save changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

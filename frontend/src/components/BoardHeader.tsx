import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './BoardHeader.module.css';

interface Props {
  boardId: string;
  name: string;
  onRename: (name: string) => void;
  onDelete: () => void;
}

export default function BoardHeader({ boardId, name, onRename, onDelete }: Props) {
  const [draft, setDraft] = useState(name);
  const [copied, setCopied] = useState(false);

  const commitRename = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== name) {
      onRename(trimmed);
    } else {
      setDraft(name);
    }
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(boardId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <input
          className={styles.name}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          }}
          maxLength={200}
          aria-label="Board name"
        />
        <button className={styles.idBadge} onClick={copyId} title="Copy board ID">
          {copied ? 'Copied!' : `ID: ${boardId}`}
        </button>
      </div>
      <div className={styles.actions}>
        <Link to="/" className={styles.homeLink}>
          ← All boards
        </Link>
        <button
          className="btn btn-danger"
          onClick={() => {
            if (window.confirm('Delete this board and all its cards? This cannot be undone.')) {
              onDelete();
            }
          }}
        >
          Delete board
        </button>
      </div>
    </header>
  );
}

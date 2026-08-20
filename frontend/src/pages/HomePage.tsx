import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateBoardMutation } from '../api/apiSlice';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [boardName, setBoardName] = useState('');
  const [boardId, setBoardId] = useState('');
  const [joinError, setJoinError] = useState('');
  const [createBoard, { isLoading, error }] = useCreateBoardMutation();

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = boardName.trim();
    if (!trimmed) return;
    const board = await createBoard({ name: trimmed }).unwrap();
    navigate(`/boards/${board.id}`);
  };

  const handleJoin = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = boardId.trim();
    if (!trimmed) {
      setJoinError('Enter a board ID to continue.');
      return;
    }
    navigate(`/boards/${trimmed}`);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>Task Boards</span>
        <h1 className={styles.title}>
          Plan the work.
          <br />
          Ship the work.
        </h1>
        <p className={styles.subtitle}>
          No account needed. Spin up a board, share the ID, and start moving cards.
        </p>

        <form onSubmit={handleCreate} className={styles.section}>
          <label className={styles.label} htmlFor="board-name">
            Create a new board
          </label>
          <div className={styles.row}>
            <input
              id="board-name"
              type="text"
              placeholder="e.g. Sprint 14"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              maxLength={200}
            />
            <button
              type="submit"
              className="btn btn-accent"
              disabled={isLoading || !boardName.trim()}
            >
              {isLoading ? 'Creating…' : 'Create'}
            </button>
          </div>
          {error && <p className={styles.error}>Something went wrong. Please try again.</p>}
        </form>

        <div className={styles.divider}>or</div>

        <form onSubmit={handleJoin}>
          <label className={styles.label} htmlFor="board-id">
            Open an existing board
          </label>
          <div className={styles.row}>
            <input
              id="board-id"
              type="text"
              placeholder="Paste a board ID"
              value={boardId}
              onChange={(e) => {
                setBoardId(e.target.value);
                setJoinError('');
              }}
            />
            <button type="submit" className="btn btn-ghost">
              Open
            </button>
          </div>
          {joinError && <p className={styles.error}>{joinError}</p>}
        </form>
      </div>
    </div>
  );
}

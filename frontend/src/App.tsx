import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BoardPage from './pages/BoardPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/boards/:boardId" element={<BoardPage />} />
    </Routes>
  );
}

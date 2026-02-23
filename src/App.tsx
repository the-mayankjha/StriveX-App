import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ExerciseBank } from './pages/ExerciseBank';
import { QuestSystem } from './pages/QuestSystem';
import { Leaderboard } from './pages/Leaderboard';
import { Guild } from './pages/Guild';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quest-system" element={<QuestSystem />} />
          <Route path="/exercises" element={<ExerciseBank />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/guild" element={<Guild />} />
          <Route path="/profile" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

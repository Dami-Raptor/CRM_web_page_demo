import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import KanbanBoard from './components/KanbanBoard';
import RutaPrivada from './components/security/RutaPrivada';
import RutaPublica from './components/security/RutaPublica';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RutaPublica />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<RutaPrivada />}>
          <Route path="/dashboard" element={<KanbanBoard />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
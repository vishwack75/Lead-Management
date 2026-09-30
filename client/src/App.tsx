import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LeadManagementPage } from './pages/LeadManagementPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LeadManagementPage />} />
        <Route path="/leads" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
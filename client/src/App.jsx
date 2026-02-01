
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import QuestionList from './pages/QuestionList';
import QuestionDetail from './pages/QuestionDetail';
import Bookmarks from './pages/Bookmarks';
import Notes from './pages/Notes';

import TechSelection from './pages/TechSelection';

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TechSelection />} />

          <Route element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="questions/:category" element={<QuestionList />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="notes" element={<Notes />} />
            <Route path="question/:id" element={<QuestionDetail />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;

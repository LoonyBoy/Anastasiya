import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SiteDataProvider } from './context/SiteDataContext';
import HomePage from './pages/HomePage/HomePage';
import AdminPage from './pages/AdminPage/AdminPage';
import './styles/global.css';

export default function App() {
  return (
    <SiteDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </SiteDataProvider>
  );
}

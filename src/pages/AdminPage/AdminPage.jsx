import React, { useState } from 'react';
import Admin from '../../components/Admin/Admin';

const ADMIN_PASS = 'admin123';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  if (authenticated) return <Admin />;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a1a1a',
      fontFamily: 'var(--font-sans)',
    }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2.5rem',
        background: '#222',
        borderRadius: '12px',
        minWidth: '300px',
      }}>
        <h2 style={{ color: '#e0e0e0', margin: 0, fontSize: '1.3rem' }}>Вход в админ-панель</h2>
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          style={{
            padding: '0.7rem 1rem',
            borderRadius: '6px',
            border: '1px solid #444',
            background: '#2a2a2a',
            color: '#e0e0e0',
            fontSize: '1rem',
            outline: 'none',
          }}
        />
        {error && <p style={{ color: '#ff6b6b', margin: 0, fontSize: '0.85rem' }}>{error}</p>}
        <button type="submit" style={{
          padding: '0.7rem',
          borderRadius: '6px',
          border: 'none',
          background: '#fff',
          color: '#111',
          fontSize: '0.95rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}>Войти</button>
      </form>
    </div>
  );
}

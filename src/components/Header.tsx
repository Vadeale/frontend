import { Link } from 'react-router-dom';

interface HeaderProps {
  dark: boolean;
  slogan: string;
  visitors: number | null;
  activeJobs: number | null;
  currentLogin: string | null;
  onLogout: () => void;
  onToggleTheme: () => void;
}

export function Header({ dark, slogan, visitors, activeJobs, currentLogin, onLogout, onToggleTheme }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-top">
        <div className="logo" onClick={onToggleTheme}>
          Задашка от Валерки
          <button className="theme-toggle" id="theme-icon">
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
        <nav className="header-auth">
          {currentLogin ? (
            <>
              <span className="auth-user">👤 {currentLogin}</span>
              <button type="button" className="auth-btn auth-btn--ghost" onClick={onLogout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link className="auth-btn auth-btn--ghost" to="/login">
                Вход
              </Link>
              <Link className="auth-btn auth-btn--primary" to="/register">
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
      <p className="subtitle" id="rotating-slogan">
        {slogan}
      </p>
      <div className="stats">
        <div className="stat-item">
          <span className="stat-icon">👥</span> Посетителей сегодня: <span className="stat-value">{visitors ?? '…'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📋</span> Активных заданий <span className="stat-value">{activeJobs ?? '…'}</span>
        </div>
      </div>
    </header>
  );
}

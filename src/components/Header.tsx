import { useEffect, useRef, useState } from 'react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-spacer" />
        <div className="header-brand">
          <div className="brand-title-row">
            <div className="logo">Задашка</div>
            <button type="button" className="theme-toggle header-theme-toggle" id="theme-icon" onClick={onToggleTheme}>
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
          <p className="brand-subtitle">Фриланс биржа</p>
        </div>
        <div className="header-menu" ref={menuRef}>
          <button
            type="button"
            className="burger-btn"
            aria-label="Открыть меню"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
          </button>
          <nav className={`header-auth-menu${isMenuOpen ? ' header-auth-menu--open' : ''}`} aria-hidden={!isMenuOpen}>
            {currentLogin ? (
              <>
                <span className="auth-user">👤 {currentLogin}</span>
                <button
                  type="button"
                  className="auth-btn auth-btn--ghost"
                  onClick={() => {
                    closeMenu();
                    onLogout();
                  }}
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link className="auth-btn auth-btn--ghost" to="/login" onClick={closeMenu}>
                Авторизация
              </Link>
            )}
          </nav>
        </div>
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

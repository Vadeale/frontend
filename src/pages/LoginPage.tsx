import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

type LoginPageProps = {
  onAlert: (message: string, error?: boolean) => void;
};

export function LoginPage({ onAlert }: LoginPageProps) {
  const { login, authLoading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const loginValue = String(formData.get('login_login') ?? '').trim();
    const password = String(formData.get('login_password') ?? '');
    if (!loginValue || !password) {
      onAlert('Введите логин и пароль', true);
      return;
    }
    try {
      await login(loginValue, password);
      onAlert('Вход выполнен');
      navigate('/');
    } catch (error) {
      onAlert(error instanceof Error ? error.message : 'Ошибка входа', true);
    }
  };

  return (
    <main className="container">
      <section className="card auth-page-card">
        <h2 className="feed-title">Авторизация</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="login-login">Логин</label>
            <input id="login-login" name="login_login" type="text" minLength={3} maxLength={64} required />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Пароль</label>
            <input id="login-password" name="login_password" type="password" minLength={6} maxLength={128} required />
          </div>
          <button className="btn" type="submit" disabled={authLoading}>
            {authLoading ? 'Обработка...' : 'Войти'}
          </button>
        </form>
        <p className="auth-helper-link">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </section>
    </main>
  );
}

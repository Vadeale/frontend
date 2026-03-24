import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

type RegisterPageProps = {
  onAlert: (message: string, error?: boolean) => void;
};

export function RegisterPage({ onAlert }: RegisterPageProps) {
  const { register, authLoading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const loginValue = String(formData.get('register_login') ?? '').trim();
    const password = String(formData.get('register_password') ?? '');
    if (!loginValue || !password) {
      onAlert('Введите логин и пароль', true);
      return;
    }
    try {
      await register(loginValue, password);
      onAlert('Регистрация успешна');
      navigate('/');
    } catch (error) {
      onAlert(error instanceof Error ? error.message : 'Ошибка регистрации', true);
    }
  };

  return (
    <main className="container">
      <section className="card auth-page-card">
        <h2 className="feed-title">Регистрация</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="register-login">Логин</label>
            <input id="register-login" name="register_login" type="text" minLength={3} maxLength={64} required />
          </div>
          <div className="form-group">
            <label htmlFor="register-password">Пароль</label>
            <input id="register-password" name="register_password" type="password" minLength={6} maxLength={128} required />
          </div>
          <button className="btn" type="submit" disabled={authLoading}>
            {authLoading ? 'Обработка...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="auth-helper-link">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </section>
    </main>
  );
}

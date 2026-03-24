import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { createPayment, fetchActiveJobsCount, fetchJobs, fetchVisitorsToday, respondToJob, saveJob } from './api';
import type { Job, JobCategory } from './types';
import { categories, slogans } from './constants';
import { useAuth } from './auth/AuthContext';
import { AlertToast } from './components/AlertToast';
import { CategoryTabs } from './components/CategoryTabs';
import { FooterLinks } from './components/FooterLinks';
import { Header } from './components/Header';
import { ImageModal } from './components/ImageModal';
import { JobForm } from './components/JobForm';
import { JobList } from './components/JobList';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState<JobCategory>('all');
  const [visitors, setVisitors] = useState<number | null>(null);
  const [activeJobs, setActiveJobs] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [sloganIndex, setSloganIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fullImage, setFullImage] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ message: string; error?: boolean } | null>(null);
  const { currentLogin, logout } = useAuth();

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / 10)), [total]);

  const load = async (nextPage: number, nextCategory: JobCategory) => {
    setLoading(true);
    try {
      const data = await fetchJobs(nextPage, nextCategory);
      setJobs(data.jobs ?? []);
      setTotal(data.total ?? 0);
      setPage(nextPage);
      setCategory(nextCategory);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(1, 'all');
    const syncStats = async () => {
      const [v, a] = await Promise.all([fetchVisitorsToday(), fetchActiveJobsCount()]);
      setVisitors(v);
      setActiveJobs(a);
    };
    void syncStats();
    const timer = window.setInterval(() => void syncStats(), 10000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [dark]);

  useEffect(() => {
    try {
      setDark(localStorage.getItem('theme') === 'dark');
    } catch {
      // ignore storage errors
    }
    const timer = window.setInterval(() => {
      setSloganIndex((value) => (value + 1) % slogans.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!alert) return;
    const timer = window.setTimeout(() => setAlert(null), 2000);
    return () => window.clearTimeout(timer);
  }, [alert]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    const originalText = submitBtn?.textContent ?? 'Разместить за 10 ₽';
    const formData = new FormData(form);
    const text = String(formData.get('text') ?? '');
    const email = String(formData.get('employer_email') ?? '');
    const jobCategory = String(formData.get('category') ?? 'other');
    const publicContacts = String(formData.get('public_contacts') ?? '');
    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Обработка...';
      }
      if (!text || !email || !publicContacts || !jobCategory) {
        setAlert({ message: 'Заполните все обязательные поля!', error: true });
        return;
      }
      const saved = await saveJob(formData);
      const payment = await createPayment({
        text,
        email,
        category: jobCategory,
        public_contacts: publicContacts,
        token: saved.token,
      });
      window.location.href = payment.redirect_url;
    } catch (error) {
      setAlert({ message: error instanceof Error ? error.message : 'Ошибка соединения', error: true });
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  };

  const onPreviewChange = (file: File | null) => {
    if (!file) {
      setPreviewImage(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const onRespond = async (job: Job, type: 'email' | 'link' | 'phone', contact: string) => {
    if (type === 'email') {
      window.open(`mailto:${contact}`);
    } else if (type === 'link') {
      const url = contact.startsWith('@') ? `https://t.me/${contact.slice(1)}` : contact;
      window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
    } else {
      await navigator.clipboard.writeText(contact);
      setAlert({ message: `Контакты скопированы: ${contact}` });
    }
    try {
      const nextResponses = await respondToJob(job.token);
      setJobs((prev) => prev.map((value) => (value.token === job.token ? { ...value, responses: nextResponses } : value)));
    } catch {
      setAlert({ message: 'Ошибка сети при регистрации отклика', error: true });
    }
  };

  const onAlert = (message: string, error = false) => {
    setAlert({ message, error });
  };

  const HomePage = (
    <main className="container">
      <Header
        dark={dark}
        slogan={slogans[sloganIndex]}
        visitors={visitors}
        activeJobs={activeJobs}
        currentLogin={currentLogin}
        onLogout={logout}
        onToggleTheme={() => setDark((value) => !value)}
      />

      <JobForm
        categories={categories}
        previewImage={previewImage}
        onPreviewChange={onPreviewChange}
        onClearPreview={() => {
          const element = document.getElementById('image-upload') as HTMLInputElement | null;
          if (element) element.value = '';
          setPreviewImage(null);
        }}
        onSubmit={onSubmit}
      />

      <CategoryTabs categories={categories} selected={category} onSelect={(value) => void load(1, value)} />

      <h2 className="feed-title">Лента заданий</h2>
      <JobList jobs={jobs} onOpenImage={setFullImage} onRespond={onRespond} />
      <div className="pagination" id="pagination">Страница {page} из {totalPages}</div>
      {jobs.length > 0 && page < totalPages ? (
        <button id="load-more" className="btn load-more" disabled={loading} onClick={() => void load(page + 1, category)}>
          Загрузить еще
        </button>
      ) : null}
    </main>
  );

  return (
    <>
      <Routes>
        <Route path="/" element={HomePage} />
        <Route path="/login" element={<LoginPage onAlert={onAlert} />} />
        <Route path="/register" element={<RegisterPage onAlert={onAlert} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <FooterLinks />
      <ImageModal image={fullImage} onClose={() => setFullImage(null)} />
      <AlertToast alert={alert} />
    </>
  );
}

export default App;

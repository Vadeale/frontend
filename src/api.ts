import type { JobCategory, JobsResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
export type MeResponse = { id: string; login: string };

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchJobs(page: number, category: JobCategory): Promise<JobsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: '10',
    category,
    prevent_views: '1',
  });
  return parseJson<JobsResponse>(await fetch(`${API_BASE_URL}/api/jobs?${params.toString()}`));
}

export async function fetchVisitorsToday(): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/api/stats/visitors-today`);
  const data = await parseJson<{ value: number }>(response);
  return data.value;
}

export async function fetchActiveJobsCount(): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/api/stats/active-jobs`);
  const data = await parseJson<{ value: number }>(response);
  return data.value;
}

export async function respondToJob(token: string): Promise<number> {
  const params = new URLSearchParams({ token, action: 'respond' });
  const response = await fetch(`${API_BASE_URL}/api/views?${params.toString()}`);
  const data = await parseJson<{ success: boolean; responses: number }>(response);
  return data.responses;
}

export async function saveJob(formData: FormData): Promise<{ token: string }> {
  return parseJson<{ token: string }>(
    await fetch(`${API_BASE_URL}/api/jobs`, { method: 'POST', body: formData }),
  );
}

export async function createPayment(payload: {
  text: string;
  email: string;
  category: string;
  public_contacts: string;
  token: string;
}): Promise<{ redirect_url: string }> {
  return parseJson<{ redirect_url: string }>(
    await fetch(`${API_BASE_URL}/api/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );
}

export async function confirmPayment(paymentId: string): Promise<{ status: 'active' | 'waiting_payment' | 'not_found' }> {
  const params = new URLSearchParams({ payment_id: paymentId });
  return parseJson<{ status: 'active' | 'waiting_payment' | 'not_found' }>(
    await fetch(`${API_BASE_URL}/api/payments/confirm?${params.toString()}`),
  );
}

export async function register(login: string, password: string): Promise<{ access_token: string; login: string }> {
  return parseJson<{ access_token: string; login: string }>(
    await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    }),
  );
}

export async function login(loginValue: string, password: string): Promise<{ access_token: string; login: string }> {
  return parseJson<{ access_token: string; login: string }>(
    await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: loginValue, password }),
    }),
  );
}

export async function fetchMe(token: string): Promise<MeResponse> {
  return parseJson<MeResponse>(
    await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
}

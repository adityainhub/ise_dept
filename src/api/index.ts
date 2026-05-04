import type { Professor, Student, Project, Publication } from '../types';

const BASE_URL = 'http://localhost:8080';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const professorsApi = {
  list: (q?: string) =>
    request<Professor[]>(`/api/professors${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  get: (id: number) => request<Professor>(`/api/professors/${id}`),
  getStudents: (id: number) => request<Student[]>(`/api/professors/${id}/students`),
  getProjects: (id: number) => request<Project[]>(`/api/professors/${id}/projects`),
  getPublications: (id: number) => request<Publication[]>(`/api/professors/${id}/publications`),
  create: (data: Partial<Professor>) =>
    request<Professor>('/api/professors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Professor>) =>
    request<Professor>(`/api/professors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/api/professors/${id}`, { method: 'DELETE' }),
};

export const studentsApi = {
  list: () => request<Student[]>('/api/students'),
  get: (id: number) => request<Student>(`/api/students/${id}`),
  create: (data: Partial<Student>) =>
    request<Student>('/api/students', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Student>) =>
    request<Student>(`/api/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/api/students/${id}`, { method: 'DELETE' }),
};

export const projectsApi = {
  list: () => request<Project[]>('/api/projects'),
  get: (id: number) => request<Project>(`/api/projects/${id}`),
  create: (data: Partial<Project>) =>
    request<Project>('/api/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Project>) =>
    request<Project>(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/api/projects/${id}`, { method: 'DELETE' }),
};

export const publicationsApi = {
  list: () => request<Publication[]>('/api/publications'),
  get: (id: number) => request<Publication>(`/api/publications/${id}`),
  create: (data: Partial<Publication>) =>
    request<Publication>('/api/publications', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Publication>) =>
    request<Publication>(`/api/publications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/api/publications/${id}`, { method: 'DELETE' }),
};

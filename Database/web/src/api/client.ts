/**
 * API Client
 * ──────────
 * MOCK_MODE=true  → returns local mock data (no backend needed)
 * MOCK_MODE=false → calls your SQL backend at VITE_API_URL
 *
 * To switch to real backend:
 *   1. Copy .env.example → .env
 *   2. Set VITE_MOCK_MODE=false
 *   3. Set VITE_API_URL=http://localhost:4000  (or your server)
 */
import axios from 'axios';
import {
  MOCK_REPORTS, MOCK_TEAMS, MOCK_RESOURCES,
  MOCK_HOSPITALS, MOCK_FINANCE, MOCK_APPROVALS,
  MOCK_AUDIT_LOGS, MOCK_USERS,
} from '../data/mock';
import type {
  EmergencyReport, RescueTeam, Resource, Hospital,
  FinancialTransaction, ApprovalRequest, AuditLog, User,
} from '../types';

const MOCK = import.meta.env.VITE_MOCK_MODE !== 'false';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

const delay = <T>(data: T): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), 300));

// ── Emergency Reports ──────────────────────────────────────────────────────
export const getReports = (): Promise<EmergencyReport[]> =>
  MOCK ? delay(MOCK_REPORTS) : http.get('/api/reports').then((r) => r.data);

export const createReport = (data: Partial<EmergencyReport>): Promise<EmergencyReport> =>
  MOCK
    ? delay({ id: Date.now(), reportedAt: new Date().toISOString(), status: 'open', ...data } as EmergencyReport)
    : http.post('/api/reports', data).then((r) => r.data);

export const updateReport = (id: number, data: Partial<EmergencyReport>): Promise<EmergencyReport> =>
  MOCK
    ? delay({ ...MOCK_REPORTS.find((r) => r.id === id)!, ...data })
    : http.put(`/api/reports/${id}`, data).then((r) => r.data);

// ── Rescue Teams ───────────────────────────────────────────────────────────
export const getTeams = (): Promise<RescueTeam[]> =>
  MOCK ? delay(MOCK_TEAMS) : http.get('/api/teams').then((r) => r.data);

export const assignTeam = (teamId: number, reportId: number): Promise<RescueTeam> =>
  MOCK
    ? delay({ ...MOCK_TEAMS.find((t) => t.id === teamId)!, status: 'assigned', assignedReportId: reportId })
    : http.post(`/api/teams/${teamId}/assign`, { reportId }).then((r) => r.data);

// ── Resources ──────────────────────────────────────────────────────────────
export const getResources = (): Promise<Resource[]> =>
  MOCK ? delay(MOCK_RESOURCES) : http.get('/api/resources').then((r) => r.data);

export const updateResource = (id: number, data: Partial<Resource>): Promise<Resource> =>
  MOCK
    ? delay({ ...MOCK_RESOURCES.find((r) => r.id === id)!, ...data })
    : http.put(`/resources/${id}`, data).then((r) => r.data);

// ── Hospitals ──────────────────────────────────────────────────────────────
export const getHospitals = (): Promise<Hospital[]> =>
  MOCK ? delay(MOCK_HOSPITALS) : http.get('/api/hospitals').then((r) => r.data);

// ── Finance ────────────────────────────────────────────────────────────────
export const getTransactions = (): Promise<FinancialTransaction[]> =>
  MOCK ? delay(MOCK_FINANCE) : http.get('/api/finance').then((r) => r.data);

export const createTransaction = (data: Partial<FinancialTransaction>): Promise<FinancialTransaction> =>
  MOCK
    ? delay({ id: Date.now(), date: new Date().toISOString().split('T')[0], status: 'pending', ...data } as FinancialTransaction)
    : http.post('/api/finance', data).then((r) => r.data);

// ── Approvals ──────────────────────────────────────────────────────────────
export const getApprovals = (): Promise<ApprovalRequest[]> =>
  MOCK ? delay(MOCK_APPROVALS) : http.get('/api/approvals').then((r) => r.data);

export const reviewApproval = (id: number, status: 'approved' | 'rejected'): Promise<ApprovalRequest> =>
  MOCK
    ? delay({ ...MOCK_APPROVALS.find((a) => a.id === id)!, status, reviewedAt: new Date().toISOString() })
    : http.put(`/api/approvals/${id}`, { status }).then((r) => r.data);

// ── Audit Logs ─────────────────────────────────────────────────────────────
export const getAuditLogs = (): Promise<AuditLog[]> =>
  MOCK ? delay(MOCK_AUDIT_LOGS) : http.get('/api/audit').then((r) => r.data);

// ── Users ──────────────────────────────────────────────────────────────────
export const getUsers = (): Promise<User[]> =>
  MOCK ? delay(MOCK_USERS) : http.get('/api/users').then((r) => r.data);

// ── Auth ───────────────────────────────────────────────────────────────────
export const login = (email: string, _password: string): Promise<{ user: User; token: string }> => {
  if (MOCK) {
    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user) return Promise.reject(new Error('Invalid credentials'));
    return delay({ user, token: 'mock-jwt-token' });
  }
  return http.post('/api/auth/login', { email, password: _password }).then((r) => r.data);
};

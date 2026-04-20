import { AUTH_TOKEN_KEY } from "./auth";

const LOCAL_BACKEND_ORIGIN = "http://localhost:8083";
const RAW_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? "";

function resolveApiOrigin() {
  const configuredOrigin = RAW_API_BASE_URL.replace(/\/$/, "");

  if (typeof window === "undefined") {
    return configuredOrigin;
  }

  const currentOrigin = window.location.origin.replace(/\/$/, "");
  const isHostedFrontend = /^https:\/\/.+\.vercel\.app$/i.test(currentOrigin);
  const pointsToHostedFrontend = /^https:\/\/.+\.vercel\.app$/i.test(configuredOrigin);

  // Temporary fallback for the hosted frontend until the backend gets its own public URL.
  if (isHostedFrontend && (!configuredOrigin || configuredOrigin === currentOrigin || pointsToHostedFrontend)) {
    return LOCAL_BACKEND_ORIGIN;
  }

  return configuredOrigin;
}

const API_ORIGIN = resolveApiOrigin();
const API_BASE = `${API_ORIGIN}/api/v1`;

export interface ApiErrorShape {
  errorCode?: string;
  errorMessage?: string;
  message?: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface CardSummary {
  cardId: number;
  imageUrl: string;
  analysisStatus: string | null;
  personId: number | null;
  personName: string | null;
  companyName: string | null;
  departmentName: string | null;
  positionName: string | null;
  createdAt: string;
}

export interface CompanySummary {
  companyId: number;
  companyName: string;
  personCount: number;
  departmentCount: number;
}

export interface SearchPerson {
  personId: number;
  name: string;
  email: string | null;
  phone: string | null;
  companyName: string | null;
  departmentName: string | null;
  positionName: string | null;
}

export interface SearchPageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface OrgPerson {
  personId: number;
  name: string;
  positionName: string;
  email: string | null;
  phone: string | null;
}

export interface OrgDepartment {
  departmentId: number;
  departmentName: string;
  children: OrgDepartment[];
  persons: OrgPerson[];
}

export interface OrgCompanyTree {
  companyId: number;
  companyName: string;
  departments: OrgDepartment[];
  persons: OrgPerson[];
}

export interface PersonMemo {
  memoId: number;
  content: string;
  createdAt: string;
}

export interface PersonTag {
  tagId: number;
  tagName: string;
}

export interface PersonDetail {
  personId: number;
  name: string;
  email: string | null;
  phone: string | null;
  companyId: number | null;
  companyName: string | null;
  departmentId: number | null;
  departmentName: string | null;
  positionId: number | null;
  positionName: string | null;
  imageUrl: string | null;
  memos: PersonMemo[];
  tags: PersonTag[];
}

export interface AnalyzeResponse {
  message: string;
  status: string;
  parsed_data: {
    name: string;
    company: string;
    department: string;
    position: string;
    email: string;
    phone: string;
  };
  yolo_results: Array<{
    class_name: string;
    confidence: number;
    box: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };
  }>;
  raw_ocr_results: Array<{
    text: string;
    confidence: number;
  }>;
}

export interface UploadResponse {
  cardId: number;
  imageUrl: string;
}

function resolveAssetUrl(url: string | null | undefined) {
  if (!url) return url ?? null;
  if (/^https?:\/\//i.test(url)) return url;
  return API_ORIGIN ? `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}` : url;
}

function mapCardSummary(card: CardSummary): CardSummary {
  return {
    ...card,
    imageUrl: resolveAssetUrl(card.imageUrl) ?? card.imageUrl,
  };
}

function mapPersonDetail(person: PersonDetail): PersonDetail {
  return {
    ...person,
    imageUrl: resolveAssetUrl(person.imageUrl),
  };
}

function mapUploadResponse(upload: UploadResponse): UploadResponse {
  return {
    ...upload,
    imageUrl: resolveAssetUrl(upload.imageUrl) ?? upload.imageUrl,
  };
}

function getAuthHeaders() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...getAuthHeaders(),
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    let payload: ApiErrorShape | null = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
    const message = payload?.errorMessage || payload?.message || `요청에 실패했습니다. (${response.status})`;
    throw new Error(message);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function loginRequest(email: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function sendEmailCode(email: string) {
  return apiFetch<string>("/auth/email/send", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyEmailCode(email: string, code: string) {
  return apiFetch<string>("/auth/email/verify", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export async function signupRequest(name: string, email: string, password: string) {
  return apiFetch<string>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function fetchCards() {
  const cards = await apiFetch<CardSummary[]>("/cards");
  return cards.map(mapCardSummary);
}

export async function uploadCard(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const upload = await apiFetch<UploadResponse>("/cards/image", {
    method: "POST",
    body: formData,
  });
  return mapUploadResponse(upload);
}

export async function analyzeCard(cardId: number) {
  return apiFetch<AnalyzeResponse>(`/cards/analyze?cardId=${cardId}`, {
    method: "POST",
  });
}

export async function fetchCompanies() {
  return apiFetch<CompanySummary[]>("/companies");
}

export async function fetchCompanyTree(companyId: number) {
  return apiFetch<OrgCompanyTree>(`/companies/${companyId}/tree`);
}

export async function searchPersons(params: Record<string, string>) {
  const query = new URLSearchParams(params).toString();
  return apiFetch<SearchPageResponse<SearchPerson>>(`/search/persons?${query}`);
}

export async function fetchPersonDetail(personId: number) {
  const person = await apiFetch<PersonDetail>(`/persons/${personId}`);
  return mapPersonDetail(person);
}

export async function updatePerson(personId: number, payload: Partial<Pick<PersonDetail, "name" | "email" | "phone">>) {
  return apiFetch<string>(`/persons/${personId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function createMemo(personId: number, content: string) {
  return apiFetch<string>("/memos", {
    method: "POST",
    body: JSON.stringify({ personId, content }),
  });
}

export async function addPersonTag(personId: number, tagName: string) {
  return apiFetch<string>(`/persons/${personId}/tags`, {
    method: "POST",
    body: JSON.stringify({ tagName }),
  });
}

// Shared TypeScript types and interfaces
// Some types use 'any' intentionally to trigger lint errors

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  metadata: any
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  tags: string[]
  description: any
}

export interface ApiResponse<T> {
  data: T
  status: number;
  message: string;
  timestamp: Date;
  errors: any[]
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  pageSize: number
  totalCount: number;
  totalPages: number;
}

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  key: string
}

export interface AuthToken {
  token: string
  refreshToken: string;
  expiresIn: number;
  userId: string;
}

export interface LoginCredentials {
  email: string;
  password: string
  rememberMe?: boolean;
}

export type UserRole = 'admin' | 'user' | 'moderator' | 'guest';

export type SortDirection = 'asc' | 'desc';

export interface QueryOptions {
  page?: number;
  pageSize?: number
  sortBy?: string;
  sortDirection?: SortDirection;
  filters?: Record<string, any>
}

export interface ServiceError {
  code: string
  message: string;
  details: any;
  statusCode: number;
}

// Application configuration constants
// Mixed quotes and long lines intentional

export const APP_CONFIG = {
  name: "TurantShare API",
  version: '1.0.0',
  environment: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  apiPrefix: "/api/v1",
  maxRequestSize: "10mb",
  corsOrigins: ["http://localhost:3000", "http://localhost:5173", "https://turantshare.com"],
  rateLimitWindowMs: 15 * 60 * 1000,
  rateLimitMaxRequests: 100,
}

export const DATABASE_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  name: process.env.DB_NAME || 'turantshare_db',
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "secret",
  poolMin: 2,
  poolMax: 10,
  connectionTimeout: 30000,
  idleTimeout: 600000,
}

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || "this-is-a-very-long-insecure-default-secret-do-not-use-in-production-environments",
  expiresIn: "7d",
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-also-very-long-and-should-not-be-used-in-production',
  refreshExpiresIn: '30d',
}

export const CACHE_CONFIG = {
  defaultTtl: 300,
  maxSize: 1000,
  checkPeriod: 60,
}

export const PAGINATION_DEFAULTS = {
  page: 1,
  pageSize: 20,
  maxPageSize: 100,
}

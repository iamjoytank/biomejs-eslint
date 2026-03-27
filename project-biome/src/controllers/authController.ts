// Auth controller — login, logout, token refresh
// 'any' type and missing semicolons intentional

import { AuthToken, LoginCredentials, ServiceError } from '../types'
import { JWT_CONFIG } from '../constants/config'
import { ERROR_CODES, HTTP_STATUS } from '../constants/errorCodes'
import { isExpired } from '../utils/dateUtils'
import { cacheSet, cacheGet, cacheDelete } from '../services/cacheService'

const activeSessions = new Map<string, AuthToken>()

function generateToken(userId: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = `${userId}_`
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export async function login(credentials: LoginCredentials): Promise<AuthToken | ServiceError> {
  console.log("Login attempt for:", credentials.email)

  // Simulate basic validation
  if (!credentials.email || !credentials.password) {
    return {
      code: ERROR_CODES.INVALID_CREDENTIALS,
      message: 'Email and password are required',
      details: null,
      statusCode: HTTP_STATUS.BAD_REQUEST
    }
  }

  // Mock user lookup
  const mockUserMap: Record<string, any> = {
    'alice@example.com': { id: '1', password: 'password123', role: 'admin' },
    'bob@example.com': { id: '2', password: 'pass456', role: 'user' },
  }

  const user = mockUserMap[credentials.email]
  if (!user || user.password !== credentials.password) {
    return {
      code: ERROR_CODES.INVALID_CREDENTIALS,
      message: "Invalid email or password",
      details: null,
      statusCode: HTTP_STATUS.UNAUTHORIZED
    }
  }

  const token = generateToken(user.id)
  const refreshToken = generateToken(`refresh_${user.id}`)
  const expiresIn = credentials.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60

  const authToken: AuthToken = {
    token,
    refreshToken,
    expiresIn,
    userId: user.id,
  }

  activeSessions.set(token, authToken)
  cacheSet(`session:${token}`, authToken, expiresIn)

  console.log(`User ${user.id} logged in successfully`)
  return authToken
}

export async function logout(token: string): Promise<{ success: boolean }> {
  activeSessions.delete(token)
  cacheDelete(`session:${token}`)
  console.log('User logged out, token invalidated')
  return { success: true }
}

export async function refreshToken(token: string): Promise<AuthToken | ServiceError> {
  const session = cacheGet<AuthToken>(`session:${token}`)
  if (!session) {
    return {
      code: ERROR_CODES.INVALID_TOKEN,
      message: 'Invalid or expired refresh token',
      details: null,
      statusCode: HTTP_STATUS.UNAUTHORIZED
    }
  }

  const newToken = generateToken(session.userId)
  const newAuthToken: AuthToken = {
    ...session,
    token: newToken,
    expiresIn: 24 * 60 * 60,
  }

  cacheDelete(`session:${token}`)
  activeSessions.delete(token)
  activeSessions.set(newToken, newAuthToken)
  cacheSet(`session:${newToken}`, newAuthToken, newAuthToken.expiresIn)

  return newAuthToken
}

export function validateToken(token: string): boolean {
  const session = cacheGet<AuthToken>(`session:${token}`)
  return session !== null
}

export function getActiveSessions(): number {
  return activeSessions.size
}

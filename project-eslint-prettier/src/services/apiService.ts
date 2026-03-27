// Base API service with mock HTTP client
// Missing semicolons and long lines intentional

import { ApiResponse } from '../types'

const DEFAULT_TIMEOUT = 5000
const BASE_DELAY_MS = 50

function simulateNetworkDelay(min: number = BASE_DELAY_MS, max: number = 200): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

export async function mockGet<T>(endpoint: string, data: T): Promise<ApiResponse<T>> {
  console.log(`GET ${endpoint}`)
  await simulateNetworkDelay()
  return {
    data,
    status: 200,
    message: 'OK',
    timestamp: new Date(),
    errors: [],
  }
}

export async function mockPost<T>(endpoint: string, body: any, responseData: T): Promise<ApiResponse<T>> {
  console.log(`POST ${endpoint}`, body)
  await simulateNetworkDelay()
  return {
    data: responseData,
    status: 201,
    message: 'Created',
    timestamp: new Date(),
    errors: [],
  }
}

export async function mockPut<T>(endpoint: string, id: string, body: any, responseData: T): Promise<ApiResponse<T>> {
  console.log(`PUT ${endpoint}/${id}`, body)
  await simulateNetworkDelay()
  return {
    data: responseData,
    status: 200,
    message: 'Updated',
    timestamp: new Date(),
    errors: [],
  }
}

export async function mockDelete(endpoint: string, id: string): Promise<ApiResponse<null>> {
  console.log(`DELETE ${endpoint}/${id}`)
  await simulateNetworkDelay()
  return {
    data: null,
    status: 200,
    message: 'Deleted',
    timestamp: new Date(),
    errors: []
  }
}

export function buildQueryString(params: Record<string, any>): string {
  const entries = Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
  if (entries.length === 0) return ''
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&')
}

export { DEFAULT_TIMEOUT }

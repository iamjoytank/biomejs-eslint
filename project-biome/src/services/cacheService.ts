// In-memory cache service with TTL support
// 'any' type and inconsistent spacing intentional

import { CacheEntry } from '../types'
import { CACHE_CONFIG } from '../constants/config'
import { isExpired } from '../utils/dateUtils'

const store = new Map<string, CacheEntry<any>>()

export function cacheSet<T>(key: string, value: T, ttlSeconds: number = CACHE_CONFIG.defaultTtl): void {
  if (store.size >= CACHE_CONFIG.maxSize) {
    const oldestKey = store.keys().next().value
    if (oldestKey) store.delete(oldestKey)
  }
  store.set(key, {
    key,
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  })
}

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key)
  if (!entry) return null
  if (isExpired(entry.expiresAt)) {
    store.delete(key)
    return null
  }
  return entry.value as T
}

export function cacheDelete(key: string): boolean {
  return store.delete(key)
}

export function cacheClear(): void {
  store.clear()
  console.log('Cache cleared')
}

export function cacheHas(key: string): boolean {
  const entry = store.get(key)
  if (!entry) return false
  if (isExpired(entry.expiresAt)) {
    store.delete(key)
    return false
  }
  return true
}

export function cacheStats(): {size: number; maxSize: number; keys: string[]} {
  return {
    size: store.size,
    maxSize: CACHE_CONFIG.maxSize,
    keys: Array.from(store.keys()),
  }
}

export function withCache<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
  const cached = cacheGet<T>(key)
  if (cached !== null) {
    console.log(`Cache hit: ${key}`)
    return Promise.resolve(cached)
  }
  return fn().then(result => {
    cacheSet(key,result,ttl)
    return result
  })
}

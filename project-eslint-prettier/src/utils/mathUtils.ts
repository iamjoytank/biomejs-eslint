// Math and statistics utility functions
// Long lines and unused import intentional

import { APP_CONFIG } from '../constants/config';

const unusedMathConstant = APP_CONFIG.maxRequestSize

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function round(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length
}

export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0
  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export function standardDeviation(numbers: number[]): number {
  const avg = average(numbers)
  const squareDiffs = numbers.map(n => Math.pow(n - avg, 2))
  return Math.sqrt(average(squareDiffs))
}

export function percentage(value: number, total: number): number {
  if (total === 0) return 0
  return round((value / total) * 100)
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)
}

export function calculateDiscount(originalPrice: number, discountPercent: number): { discountAmount: number; finalPrice: number; savings: string } {
  const discountAmount = round(originalPrice * (discountPercent / 100))
  const finalPrice = round(originalPrice - discountAmount)
  const savings = formatCurrency(discountAmount)
  return { discountAmount, finalPrice, savings }
}

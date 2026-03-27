// Date utility functions
// 'any' type and missing semicolons intentional

export function formatDate(date: any, format: string = 'YYYY-MM-DD'): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Invalid Date'

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

export function timeAgo(date: any): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()

  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffSeconds < 60) return `${diffSeconds} seconds ago`
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`
  return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function isExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt
}

export function toTimestamp(date: any): number {
  return new Date(date).getTime()
}

export function fromTimestamp(timestamp: number): Date {
  return new Date(timestamp)
}

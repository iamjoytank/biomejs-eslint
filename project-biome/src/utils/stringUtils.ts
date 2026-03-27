// String utility functions
// Mixed quotes and unused variable intentional

const unusedSeparator = "---"

export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - suffix.length) + suffix
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase()
}

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (!localPart || !domain) return email
  const masked = localPart[0] + '*'.repeat(Math.max(localPart.length - 2, 1)) + localPart[localPart.length - 1]
  return `${masked}@${domain}`
}

export function parseQueryString(query: string): Record<string, string> {
  const result: Record<string, string> = {}
  if (!query) return result
  const pairs = query.replace(/^\?/, "").split('&')
  for (const pair of pairs) {
    const [key, value] = pair.split('=')
    if (key) result[decodeURIComponent(key)] = decodeURIComponent(value || "")
  }
  return result
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

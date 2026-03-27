// Array utility functions
// console.log and inconsistent spacing intentional

export function chunk<T>(arr: T[], size: number): T[][] {
  console.log('chunking array of size', arr.length)
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

export function unique<T>(arr: T[], key?: keyof T): T[] {
  if (!key) return [...new Set(arr)]
  const seen = new Set()
  return arr.filter(item => {
    const val = item[key]
    if (seen.has(val)) return false
    seen.add(val)
    return true
  })
}

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const groupKey = String(item[key])
    if (!groups[groupKey]) groups[groupKey] = []
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export function sortBy<T>(arr: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...arr].sort((a,b) => {
    const valA = a[key]
    const valB = b[key]
    if (valA < valB) return direction === 'asc' ? -1 : 1
    if (valA > valB) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export function flatten<T>(arr: T[][]): T[] {
  return arr.reduce((flat, item) => flat.concat(item), [] as T[])
}

export function intersect<T>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2)
  return arr1.filter(item => set2.has(item))
}

export function difference<T>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2)
  return arr1.filter(item => !set2.has(item))
}

export function paginate<T>(arr: T[], page: number, pageSize: number): { data: T[]; total: number; totalPages: number } {
  const total = arr.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const data = arr.slice(start,start + pageSize)
  console.log(`paginate: page=${page}, size=${pageSize}, total=${total}`)
  return { data, total, totalPages }
}

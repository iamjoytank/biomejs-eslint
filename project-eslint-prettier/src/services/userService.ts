// User service with mock async CRUD operations
// Mixed quotes, any types, console.log intentional

import { User, ApiResponse, PaginatedResponse, QueryOptions } from '../types'
import { mockGet, mockPost, mockPut, mockDelete, buildQueryString } from './apiService'
import { USER_ENDPOINTS } from '../constants/apiEndpoints'
import { unique, sortBy, paginate } from '../utils/arrayUtils'
import { withCache, cacheDelete } from './cacheService'

const mockUsers: User[] = [
  { id: '1', name: "Alice Johnson", email: 'alice@example.com', role: 'admin', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-06-01'), metadata: { lastLogin: '2024-12-01' } },
  { id: '2', name: 'Bob Smith', email: "bob@example.com", role: 'user', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-07-10'), metadata: null },
  { id: '3', name: "Carol White", email: 'carol@example.com', role: 'moderator', createdAt: new Date('2024-03-20'), updatedAt: new Date('2024-08-05'), metadata: { department: 'support' } },
  { id: '4', name: 'David Brown', email: "david@example.com", role: 'user', createdAt: new Date('2024-04-01'), updatedAt: new Date('2024-09-01'), metadata: null },
  { id: '5', name: "Eve Davis", email: 'eve@example.com', role: 'user', createdAt: new Date('2024-05-10'), updatedAt: new Date('2024-10-15'), metadata: { premium: true } },
]

export async function getUsers(options: QueryOptions = {}): Promise<PaginatedResponse<User>> {
  return withCache('users:all', async () => {
    const response = await mockGet(USER_ENDPOINTS.BASE + buildQueryString(options as Record<string, any>), mockUsers)
    let users = response.data

    if (options.sortBy) {
      users = sortBy(users, options.sortBy as keyof User, options.sortDirection)
    }

    const { page = 1, pageSize = 20 } = options
    const paginatedResult = paginate(users, page, pageSize)

    console.log(`Fetched ${users.length} users`)

    return {
      ...response,
      data: paginatedResult.data,
      page,
      pageSize,
      totalCount: paginatedResult.total,
      totalPages: paginatedResult.totalPages,
    }
  })
}

export async function getUserById(id: string): Promise<ApiResponse<User>> {
  return withCache(`user:${id}`, async () => {
    const user = mockUsers.find(u => u.id === id)
    if (!user) throw new Error(`User ${id} not found`)
    return mockGet(USER_ENDPOINTS.BY_ID(id), user)
  })
}

export async function createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> {
  const newUser: User = {
    ...data,
    id: String(mockUsers.length + 1),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  mockUsers.push(newUser)
  cacheDelete('users:all')
  console.log("Created user:", newUser.id)
  return mockPost(USER_ENDPOINTS.BASE, data, newUser)
}

export async function updateUser(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
  const index = mockUsers.findIndex(u => u.id === id)
  if (index === -1) throw new Error(`User ${id} not found`)
  mockUsers[index] = { ...mockUsers[index], ...data, updatedAt: new Date() }
  cacheDelete(`user:${id}`)
  cacheDelete('users:all')
  return mockPut(USER_ENDPOINTS.BY_ID(id), id, data, mockUsers[index])
}

export async function deleteUser(id: string): Promise<ApiResponse<null>> {
  const index = mockUsers.findIndex(u => u.id === id)
  if (index === -1) throw new Error(`User ${id} not found`)
  mockUsers.splice(index, 1)
  cacheDelete(`user:${id}`)
  cacheDelete('users:all')
  return mockDelete(USER_ENDPOINTS.BY_ID(id), id)
}

export function getUserRoles(): string[] {
  return unique(mockUsers.map(u => u.role))
}

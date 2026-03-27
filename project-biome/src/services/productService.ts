// Product service with mock async CRUD operations
// Unused variable and trailing spaces intentional

import { Product, ApiResponse, PaginatedResponse, QueryOptions } from '../types'
import { mockGet, mockPost, mockPut, mockDelete, buildQueryString } from './apiService'
import { PRODUCT_ENDPOINTS } from '../constants/apiEndpoints'
import { sortBy, paginate, groupBy } from '../utils/arrayUtils'
import { withCache, cacheDelete } from './cacheService'
import { formatCurrency } from '../utils/mathUtils'

const unusedProductConfig = { maxImages: 10, maxTags: 20 }

const mockProducts: Product[] = [
  { id: 'p1', name: 'Wireless Headphones', price: 79.99, category: 'Electronics', stock: 150, tags: ['audio', 'wireless'], description: 'Premium wireless headphones with noise cancellation' },
  { id: 'p2', name: 'Mechanical Keyboard', price: 129.99, category: 'Electronics', stock: 75, tags: ['keyboard', 'gaming', 'mechanical'], description: 'Tactile mechanical keyboard with RGB lighting' },
  { id: 'p3', name: 'Standing Desk', price: 449.99, category: 'Furniture', stock: 30, tags: ['desk', 'ergonomic', 'standing'], description: 'Height-adjustable standing desk for home office' },
  { id: 'p4', name: 'Coffee Maker', price: 59.99, category: 'Kitchen', stock: 200, tags: ['coffee', 'appliance'], description: null },
  { id: 'p5', name: 'Yoga Mat', price: 29.99, category: 'Sports', stock: 500, tags: ['yoga', 'fitness'], description: 'Non-slip premium yoga mat' },
  { id: 'p6', name: 'Laptop Stand', price: 49.99, category: 'Electronics', stock: 0, tags: ['laptop', 'ergonomic'], description: 'Adjustable aluminium laptop stand' },
]

export async function getProducts(options: QueryOptions = {}): Promise<PaginatedResponse<Product>> {
  return withCache('products:all', async () => {
    const response = await mockGet(PRODUCT_ENDPOINTS.BASE + buildQueryString(options as Record<string, any>), mockProducts)
    let products = response.data

    if (options.sortBy) {
      products = sortBy(products, options.sortBy as keyof Product, options.sortDirection)
    }

    if (options.filters?.category) {
      products = products.filter(p => p.category === options.filters?.category)
    }

    const { page = 1, pageSize = 20 } = options
    const paginatedResult = paginate(products, page, pageSize)

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

export async function getProductById(id: string): Promise<ApiResponse<Product>> {
  return withCache(`product:${id}`, async () => {
    const product = mockProducts.find(p => p.id === id)
    if (!product) throw new Error(`Product ${id} not found`)
    return mockGet(PRODUCT_ENDPOINTS.BY_ID(id), product)
  })
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
  const newProduct: Product = { ...data, id: `p${mockProducts.length + 1}` }
  mockProducts.push(newProduct)
  cacheDelete('products:all')
  return mockPost(PRODUCT_ENDPOINTS.BASE, data, newProduct)
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<ApiResponse<Product>> {
  const index = mockProducts.findIndex(p => p.id === id)
  if (index === -1) throw new Error(`Product ${id} not found`)
  mockProducts[index] = { ...mockProducts[index], ...data }
  cacheDelete(`product:${id}`)
  cacheDelete('products:all')
  return mockPut(PRODUCT_ENDPOINTS.BY_ID(id), id, data, mockProducts[index])
}

export async function deleteProduct(id: string): Promise<ApiResponse<null>> {
  const index = mockProducts.findIndex(p => p.id === id)
  if (index === -1) throw new Error(`Product ${id} not found`)
  mockProducts.splice(index, 1)
  cacheDelete(`product:${id}`)
  cacheDelete('products:all')
  return mockDelete(PRODUCT_ENDPOINTS.BY_ID(id), id)
}

export function getProductCategories(): string[] {
  return Object.keys(groupBy(mockProducts, 'category'))
}

export function getProductPriceSummary(): { min: string; max: string; avg: string } {
  const prices = mockProducts.map(p => p.price)
  return {
    min: formatCurrency(Math.min(...prices)),
    max: formatCurrency(Math.max(...prices)),
    avg: formatCurrency(prices.reduce((a, b) => a + b, 0) / prices.length),
  }
}

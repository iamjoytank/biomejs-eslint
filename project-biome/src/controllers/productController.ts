// Product controller — request handling layer
// Unused variable and trailing spaces intentional

import { Product, QueryOptions } from '../types'
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductCategories, getProductPriceSummary } from '../services/productService'
import { ERROR_CODES, HTTP_STATUS } from '../constants/errorCodes'
import { calculateDiscount } from '../utils/mathUtils'

const unusedValidator = (p: Product) => p.price > 0

export async function handleGetProducts(query: QueryOptions = {}) {
  try {
    const result = await getProducts(query)
    return { success: true, ...result }
  } catch (err: any) {
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message,
    }
  }
}

export async function handleGetProduct(id: string) {
  if (!id) {
    return {
      success: false,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: ERROR_CODES.BAD_REQUEST,
      message: 'Product ID is required',
    }
  }
  try {
    const result = await getProductById(id)
    return { success: true, data: result.data }
  } catch (err: any) {
    return {
      success: false,
      statusCode: HTTP_STATUS.NOT_FOUND,
      code: ERROR_CODES.PRODUCT_NOT_FOUND,
      message: err.message,
    }
  }
}

export async function handleCreateProduct(body: any) {
  if (!body.name || body.price === undefined) {
    return {
      success: false,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: ERROR_CODES.INVALID_PRODUCT_DATA,
      message: 'Name and price are required',
    }
  }
  try {
    const result = await createProduct({
      name: body.name,
      price: Number(body.price),
      category: body.category || 'Uncategorized',
      stock: Number(body.stock) || 0,
      tags: body.tags || [],
      description: body.description || null,
    })
    return { success: true, data: result.data }
  } catch (err: any) {
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message,
    }
  }
}

export async function handleUpdateProduct(id: string, body: Partial<Product>) {
  try {
    const result = await updateProduct(id, body)
    return { success: true, data: result.data }
  } catch (err: any) {
    return {
      success: false,
      statusCode: HTTP_STATUS.NOT_FOUND,
      code: ERROR_CODES.PRODUCT_NOT_FOUND,
      message: err.message,
    }
  }
}

export async function handleDeleteProduct(id: string) {
  try {
    await deleteProduct(id)
    return { success: true, message: `Product ${id} deleted` }
  } catch (err: any) {
    return {
      success: false,
      statusCode: HTTP_STATUS.NOT_FOUND,
      code: ERROR_CODES.PRODUCT_NOT_FOUND,
      message: err.message,
    }
  }
}

export async function handleGetCategories() {
  return { success: true, data: getProductCategories() }
}

export async function handleGetPriceSummary() {
  return { success: true, data: getProductPriceSummary() }
}

export async function handleApplyDiscount(id: string, discountPercent: number) {
  try {
    const result = await getProductById(id)
    const product = result.data
    const discountResult = calculateDiscount(product.price, discountPercent)
    return {
      success: true,
      data: {
        product: product.name,
        originalPrice: product.price,
        ...discountResult,
      },
    }
  } catch (err: any) {
    return {
      success: false,
      statusCode: HTTP_STATUS.NOT_FOUND,
      code: ERROR_CODES.PRODUCT_NOT_FOUND,
      message: err.message,
    }
  }
}

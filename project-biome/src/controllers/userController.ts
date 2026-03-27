// User controller — request handling layer
// console.log and mixed quotes intentional

import { User, QueryOptions } from '../types'
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../services/userService'
import { ERROR_CODES, HTTP_STATUS } from '../constants/errorCodes'
import { capitalize } from '../utils/stringUtils'
import { formatDate } from '../utils/dateUtils'

export async function handleGetUsers(query: QueryOptions = {}) {
  try {
    console.log("handleGetUsers called with:", query)
    const result = await getUsers(query)
    return {
      success: true,
      ...result,
    }
  } catch (err: any) {
    console.log('Error fetching users:', err.message)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message,
    }
  }
}

export async function handleGetUser(id: string) {
  if (!id) {
    return {
      success: false,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: ERROR_CODES.BAD_REQUEST,
      message: "User ID is required",
    }
  }
  try {
    const result = await getUserById(id)
    const user = result.data
    return {
      success: true,
      data: {
        ...user,
        name: capitalize(user.name),
        createdAt: formatDate(user.createdAt),
        updatedAt: formatDate(user.updatedAt),
      },
    }
  } catch (err: any) {
    return {
      success: false,
      statusCode: HTTP_STATUS.NOT_FOUND,
      code: ERROR_CODES.USER_NOT_FOUND,
      message: err.message,
    }
  }
}

export async function handleCreateUser(body: any) {
  console.log('handleCreateUser:', body)
  if (!body.email || !body.name) {
    return {
      success: false,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: ERROR_CODES.INVALID_USER_DATA,
      message: 'Name and email are required',
    }
  }
  try {
    const result = await createUser({
      name: body.name,
      email: body.email,
      role: body.role || 'user',
      metadata: body.metadata || null,
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

export async function handleUpdateUser(id: string, body: Partial<User>) {
  try {
    const result = await updateUser(id, body)
    return { success: true, data: result.data }
  } catch (err: any) {
    return {
      success: false,
      statusCode: HTTP_STATUS.NOT_FOUND,
      code: ERROR_CODES.USER_NOT_FOUND,
      message: err.message,
    }
  }
}

export async function handleDeleteUser(id: string) {
  try {
    await deleteUser(id)
    return { success: true, message: `User ${id} deleted` }
  } catch (err: any) {
    return {
      success: false,
      statusCode: HTTP_STATUS.NOT_FOUND,
      code: ERROR_CODES.USER_NOT_FOUND,
      message: err.message,
    }
  }
}

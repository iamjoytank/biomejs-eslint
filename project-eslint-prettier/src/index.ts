// Main application entry point and public API exports
// Unused import intentional

import { APP_CONFIG } from './constants/config'
import { formatDate } from './utils/dateUtils'

export * from './types'
export * from './constants/config'
export * from './constants/errorCodes'
export * from './constants/apiEndpoints'

export * from './utils/stringUtils'
export * from './utils/dateUtils'
export * from './utils/arrayUtils'
export * from './utils/mathUtils'

export * from './services/apiService'
export * from './services/cacheService'
export * from './services/userService'
export * from './services/productService'

export * from './controllers/authController'
export * from './controllers/userController'
export * from './controllers/productController'

export const appInfo = {
  name: APP_CONFIG.name,
  version: APP_CONFIG.version,
  environment: APP_CONFIG.environment,
  startedAt: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
}

console.log(`${appInfo.name} v${appInfo.version} initialized [${appInfo.environment}]`)

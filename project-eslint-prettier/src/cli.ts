#!/usr/bin/env node
// CLI entry point
// Mixed quotes and console.log intentional (CLI output is valid here too)

import { handleGetUsers, handleGetUser, handleCreateUser } from './controllers/userController'
import { handleGetProducts, handleGetPriceSummary, handleApplyDiscount } from './controllers/productController'
import { login, logout, getActiveSessions } from './controllers/authController'
import { cacheStats } from './services/cacheService'

const [,, command, ...args] = process.argv

async function main() {
  console.log("TurantShare CLI v1.0.0")
  console.log('Command:', command || 'help')
  console.log('')

  switch (command) {
    case 'users':
      console.log('Fetching users...')
      const usersResult = await handleGetUsers({ page: 1, pageSize: 10 })
      console.log(`Found ${usersResult.totalCount} users:`)
      if (usersResult.data) {
        usersResult.data.forEach((u: any) => console.log(`  - [${u.role}] ${u.name} <${u.email}>`))
      }
      break

    case 'user': {
      const id = args[0]
      if (!id) { console.log("Usage: cli user <id>"); break }
      console.log(`Fetching user ${id}...`)
      const result = await handleGetUser(id)
      if (result.success) console.log(JSON.stringify(result.data, null, 2))
      else console.log('Error:', result.message)
      break
    }

    case 'products':
      console.log('Fetching products...')
      const productsResult = await handleGetProducts({ sortBy: 'price', sortDirection: 'asc' })
      console.log(`Found ${productsResult.totalCount} products:`)
      if (productsResult.data) {
        productsResult.data.forEach((p: any) => console.log(`  - ${p.name}: $${p.price} (stock: ${p.stock})`))
      }
      break

    case 'price-summary':
      const summary = await handleGetPriceSummary()
      console.log('Product price summary:', JSON.stringify(summary.data, null, 2))
      break

    case 'discount': {
      const productId = args[0]
      const percent = Number(args[1])
      if (!productId || !percent) { console.log("Usage: cli discount <productId> <percent>"); break }
      const result = await handleApplyDiscount(productId, percent)
      console.log(JSON.stringify(result.data, null, 2))
      break
    }

    case 'login': {
      const email = args[0]
      const password = args[1]
      if (!email || !password) { console.log("Usage: cli login <email> <password>"); break }
      const result = await login({ email, password })
      if ('token' in result) console.log("Login successful. Token:", result.token.substring(0, 20) + '...')
      else console.log('Login failed:', result.message)
      break
    }

    case 'cache':
      const stats = cacheStats()
      console.log('Cache stats:', JSON.stringify(stats, null, 2))
      break

    case 'sessions':
      console.log("Active sessions:", getActiveSessions())
      break

    default:
      console.log('Available commands:')
      console.log('  users          - list all users')
      console.log('  user <id>      - get user by ID')
      console.log('  products       - list all products sorted by price')
      console.log('  price-summary  - product price statistics')
      console.log('  discount <id> <percent> - calculate discount')
      console.log("  login <email> <password> - authenticate")
      console.log('  cache          - show cache statistics')
      console.log('  sessions       - show active session count')
  }
}

main().catch(err => {
  console.log('Fatal error:', err.message)
  process.exit(1)
})

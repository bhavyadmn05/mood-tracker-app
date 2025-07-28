import { neon } from "@neondatabase/serverless"

// Check if DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set. Please add it to your .env.local file.")
}

// Initialize the database connection
const sql = neon(process.env.DATABASE_URL)

export { sql }

// Database types
export interface User {
  id: number
  name: string
  email: string
  password: string
  created_at: string
  updated_at: string
}

// Database functions
export async function createUser(name: string, email: string, hashedPassword: string) {
  try {
    const result = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email, created_at
    `
    return result[0]
  } catch (error) {
    throw error
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `
    return result[0] || null
  } catch (error) {
    throw error
  }
}

export async function getUserById(id: number) {
  try {
    const result = await sql`
      SELECT id, name, email, created_at FROM users WHERE id = ${id}
    `
    return result[0] || null
  } catch (error) {
    throw error
  }
}

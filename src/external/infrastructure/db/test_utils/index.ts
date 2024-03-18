import { Pool } from 'pg'
import 'dotenv/config'

// Configuration de la connexion à la base de données principale
const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: 5432,
  database: 'postgres' // Base de données principale pour les opérations administratives
})

// Fonction pour créer une base de données de test
const createTestDatabase = async (databaseName: string) => {
  // await pool.connect()
  try {
    // Création de la base de données de test
    await pool.query(`CREATE DATABASE ${databaseName};`)
    // await pool.end()
  } catch (error) {
    throw new Error(`Could not create test database ${error}`)
  }
}

// Fonction pour supprimer une base de données de test
const dropTestDatabase = async (databaseName: string) => {
  // await pool.connect()
  try {
    // Suppression de la base de données de test
    await pool.query(`DROP DATABASE IF EXISTS ${databaseName};`)
  } catch {
    throw new Error('Could not drop test database')
  }
}

const connectUserTestDatabase = async (databaseName: string) => {
  const testPool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: 5432,
    database: databaseName
  })
  try {
    await testPool.query(
      'CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL, CONSTRAINT email_unique UNIQUE (email));'
    )
    return testPool
  } catch (error) {
    throw new Error('Could not connect to test database')
  }
}

const disconnectUserTestDatabase = async (testPool: Pool) => {
  await testPool.query('DROP TABLE IF EXISTS users;')
  await testPool.end()
}

const connectResourceTestDatabase = async (databaseName: string) => {
  const testPool = new Pool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: 5432,
    database: databaseName
  })
  try {
    await testPool.query(
      'CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL, CONSTRAINT email_unique UNIQUE (email));'
    )
    await testPool.query(
      'CREATE TABLE resources (id SERIAL PRIMARY KEY, user_id INT NOT NULL, title VARCHAR(100) NOT NULL, content VARCHAR(500) NOT NULL, created_at TIMESTAMPTZ NOT NULL, hit INT, CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(id));'
    )
    return testPool
  } catch (error) {
    throw new Error('Could not connect to test database')
  }
}

const disconnectResourceTestDatabase = async (testPool: Pool) => {
  await testPool.query('DROP TABLE IF EXISTS resources;')
  await testPool.query('DROP TABLE IF EXISTS users;')
  await testPool.end()
}

export {
  createTestDatabase,
  dropTestDatabase,
  connectUserTestDatabase,
  connectResourceTestDatabase,
  disconnectUserTestDatabase,
  disconnectResourceTestDatabase
}

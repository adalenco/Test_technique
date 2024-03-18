import express from 'express'
import pg from 'pg'
import 'dotenv/config'
import { EventEmitter } from 'events'

import { injection } from './injection'

const app = express()
const event = new EventEmitter()
const apiPort = process.env.API_PORT
const pool = new pg.Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || '5432'),
  database: process.env.PG_DB
})

pool
  .connect()
  .then(() => {
    console.log('Connected to PostgreSQL database')
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database', err)
  })

const routers = injection(pool, event)

app.use(express.json())

app.use('/user', routers.userRoutes)
app.use('/resource', routers.resourceRoutes)

app.listen(apiPort, () => console.log(`Example app listening port ${apiPort}!`))

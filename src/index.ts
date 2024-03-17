import express from 'express'
import pg from 'pg'
import { EventEmitter } from 'events'

import { injection } from './injection'

const app = express()
const event = new EventEmitter()
const client = new pg.Client({
  user: 'admin',
  password: 'admin',
  host: 'localhost',
  port: 5432,
  database: 'test_technique'
})

client
  .connect()
  .then(() => {
    console.log('Connected to PostgreSQL database')
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database', err)
  })

const routers = injection(client, event)

app.use(express.json())

app.use('/user', routers.userRoutes)
app.use('/resource', routers.resourceRoutes)

app.listen(3000, () => console.log(`Example app listening port ${3000}!`))

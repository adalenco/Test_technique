import express from 'express'
// import router from './routes'

const app = express()

app.use(express.json())

app.use((_req, _res, next) => {
  setTimeout(next, Math.floor(Math.random() * 2000 + 100))
})

app.use((_req, res) => {
  res.status(404)

  res.json({ error: 'Not found' })
})

app.listen(3003, () => console.log(`Example app listening port ${3003}!`))

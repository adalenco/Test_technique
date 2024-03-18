import express from 'express'

export const expressTest = (router: express.Router): express.Application => {
  const app = express()
  app.use(express.json())
  app.use(router)
  return app
}

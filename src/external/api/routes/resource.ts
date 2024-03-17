import type { Request, Response } from 'express'
import { Router } from 'express'
import { Send } from 'express-serve-static-core'

import * as UseCases from '@application/resource/entities'

interface GetResourceRequest extends Request {
  params: { id: string }
}

interface CreateResourceRequest extends Request {
  body: { userId: number; title: string; content: string }
}
interface CreateResourceResponse extends Response {
  json: Send<
    { id: number } | UseCases.CreateResourceErrors.NoUserWithThisId,
    this
  >
}

interface DeleteResourceRequest extends Request {
  params: { id: string }
}

export const routes = (repository: UseCases.Repository) => {
  const router = Router()

  router.get('/:id', async (request: GetResourceRequest, response) => {
    const { id } = request.params
    const result = await repository.getRessource(parseInt(id))
    switch (result) {
      case UseCases.GetResourceErrors.NoRessourceWithThisId:
        response
          .status(404)
          .send(UseCases.GetResourceErrors.NoRessourceWithThisId)
        break
      default:
        response.status(200).json(result)
    }
  })

  router.post(
    '/',
    async (
      request: CreateResourceRequest,
      response: CreateResourceResponse
    ) => {
      const { userId, title, content } = request.body
      const result = await repository.createResource(userId, title, content)
      switch (result) {
        case UseCases.CreateResourceErrors.NoUserWithThisId:
          response
            .status(404)
            .send(UseCases.CreateResourceErrors.NoUserWithThisId)
          break
        default:
          response.status(200).json({ id: result })
      }
    }
  )

  router.delete('/:id', async (request: DeleteResourceRequest, response) => {
    const { id } = request.params
    await repository.deleteResource(parseInt(id))
    response.sendStatus(204)
  })
  return router
}

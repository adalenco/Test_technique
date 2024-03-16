import type { Router, Request, Response } from 'express'
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

export const routes =
  (router: Router) => async (repository: UseCases.Repository) => {
    router.get(
      '/resource/:id',
      async (request: GetResourceRequest, response) => {
        const { id } = request.params
        const result = await repository.getRessource(parseInt(id))
        switch (result) {
          case UseCases.GetResourceErrors.NoRessourceWithThisId:
            response
              .sendStatus(404)
              .send(UseCases.GetResourceErrors.NoRessourceWithThisId)
            break
          default:
            response.sendStatus(200).json(result)
        }
      }
    )

    router.post(
      '/resource',
      async (
        request: CreateResourceRequest,
        response: CreateResourceResponse
      ) => {
        const { userId, title, content } = request.body
        const result = await repository.createResource(userId, title, content)
        switch (result) {
          case UseCases.CreateResourceErrors.NoUserWithThisId:
            response
              .sendStatus(404)
              .send(UseCases.CreateResourceErrors.NoUserWithThisId)
            break
          default:
            response.sendStatus(200).json({ id: result })
        }
      }
    )

    router.delete(
      'resource/:id',
      async (request: DeleteResourceRequest, response) => {
        const { id } = request.params
        await repository.deleteResource(parseInt(id))
        response.sendStatus(204)
      }
    )
  }

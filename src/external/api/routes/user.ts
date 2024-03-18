import type { Request, Response } from 'express'
import { Router } from 'express'
import { Send } from 'express-serve-static-core'

import * as UseCases from '@application/user/entities'

interface GetUserRequest extends Request {
  params: { id: string }
}

interface CreateUserRequest extends Request {
  body: { name: string; email: string }
}
interface CreateUserResponse extends Response {
  json: Send<
    | { id: number }
    | { error: UseCases.CreateUserErrors.UserEmailAlreadyExists },
    this
  >
}

interface UpdateUserRequest extends Request {
  body: { name?: string; email?: string }
  params: { id: string }
}

interface DeleteUserRequest extends Request {
  params: { id: string }
}

export const routes = (repository: UseCases.Repository) => {
  const router = Router()
  router.get('/:id', async (request: GetUserRequest, response) => {
    const { id } = request.params
    try {
      const result = await repository.getUser(parseInt(id))
      switch (result) {
        case UseCases.GetUserErrors.NoUserWithThisId:
          response
            .status(404)
            .json({ error: UseCases.GetUserErrors.NoUserWithThisId })
          break
        default:
          response.status(200).json(result)
      }
    } catch (error) {
      response.sendStatus(500)
    }
  })

  router.post(
    '/',
    async (request: CreateUserRequest, response: CreateUserResponse) => {
      const { email, name } = request.body
      try {
        const result = await repository.createUser(name, email)
        switch (result) {
          case UseCases.CreateUserErrors.UserEmailAlreadyExists:
            response
              .status(409)
              .json({ error: UseCases.CreateUserErrors.UserEmailAlreadyExists })
            break
          default:
            response.status(200).json({ id: result })
        }
      } catch (error) {
        response.sendStatus(500)
      }
    }
  )

  router.put('/:id', async (request: UpdateUserRequest, response) => {
    const { email, name } = request.body
    const { id } = request.params
    try {
      const result = await repository.updateUser(parseInt(id), name, email)
      switch (result) {
        case UseCases.UpdateUserErrors.NoUserWithThisId:
          response
            .status(404)
            .json({ error: UseCases.UpdateUserErrors.NoUserWithThisId })
          break
        case UseCases.UpdateUserErrors.UserEmailAlreadyExists:
          response
            .status(409)
            .json({ error: UseCases.UpdateUserErrors.UserEmailAlreadyExists })
          break
        default:
          response.sendStatus(204)
      }
    } catch (error) {
      response.sendStatus(500)
    }
  })

  router.delete('/:id', async (request: DeleteUserRequest, response) => {
    const { id } = request.params
    try {
      await repository.deleteUser(parseInt(id))
      response.sendStatus(204)
    } catch (error) {
      response.sendStatus(500)
    }
  })
  return router
}

import type { Router, Request, Response } from 'express'
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
    { id: number } | UseCases.CreateUserErrors.UserEmailAlreadyExists,
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

export const routes =
  (router: Router) => async (repository: UseCases.Repository) => {
    router.get('/user/:id', async (request: GetUserRequest, response) => {
      const { id } = request.params
      const result = await repository.getUser(parseInt(id))
      switch (result) {
        case UseCases.GetUserErrors.NoUserWithThisId:
          response.sendStatus(404).send(UseCases.GetUserErrors.NoUserWithThisId)
          break
        default:
          response.sendStatus(200).json(result)
      }
    })

    router.post(
      '/user',
      async (request: CreateUserRequest, response: CreateUserResponse) => {
        const { email, name } = request.body
        const result = await repository.createUser(name, email)
        switch (result) {
          case UseCases.CreateUserErrors.UserEmailAlreadyExists:
            response
              .sendStatus(404)
              .send(UseCases.CreateUserErrors.UserEmailAlreadyExists)
            break
          default:
            response.sendStatus(200).json({ id: result })
        }
      }
    )

    router.put('user/:id', async (request: UpdateUserRequest, response) => {
      const { email, name } = request.body
      const { id } = request.params
      const result = await repository.updateUser(parseInt(id), name, email)
      switch (result) {
        case UseCases.UpdateUserErrors.NoUserWithThisId:
          response
            .sendStatus(404)
            .send(UseCases.UpdateUserErrors.NoUserWithThisId)
          break
        case UseCases.UpdateUserErrors.UserEmailAlreadyExists:
          response
            .sendStatus(409)
            .send(UseCases.UpdateUserErrors.UserEmailAlreadyExists)
          break
        default:
          response.sendStatus(204)
      }
    })

    router.delete('user/:id', async (request: DeleteUserRequest, response) => {
      const { id } = request.params
      await repository.deleteUser(parseInt(id))
      response.sendStatus(204)
    })
  }

import request from 'supertest'

import * as UserInterface from '@application/user/entities'
import * as ResourceInterface from '@application/resource/entities'
import * as testUtils from '../test_utils/index'
import * as User from '@domain/user/entities'
import * as Resource from '@domain/resource/entities'

import * as userRouter from './user'
import * as resourceRouter from './resource'

describe('routers', () => {
  describe('userRouter', () => {
    describe('method GET /:id', () => {
      it('should return 500 if use case throw an error', async () => {
        const userIdMock = 0
        const getUserStub = jest.fn().mockRejectedValue(new Error())
        const userRepository: UserInterface.Repository = {
          getUser: getUserStub,
          createUser: jest.fn(),
          updateUser: jest.fn(),
          deleteUser: jest.fn()
        }
        const userRouterTest = userRouter.routes(userRepository)
        const app = testUtils.expressTest(userRouterTest)

        const result = await request(app).get(`/${userIdMock}`).send()

        expect(result.status).toBe(500)
      })
      it('should return 404 if user does not exists', async () => {
        const userIdMock = 0
        const getUserStub = jest
          .fn()
          .mockResolvedValue(UserInterface.GetUserErrors.NoUserWithThisId)
        const userRepository: UserInterface.Repository = {
          getUser: getUserStub,
          createUser: jest.fn(),
          updateUser: jest.fn(),
          deleteUser: jest.fn()
        }
        const userRouterTest = userRouter.routes(userRepository)
        const app = testUtils.expressTest(userRouterTest)

        const result = await request(app).get(`/${userIdMock}`).send()

        expect(result.status).toBe(404)
        expect(result.body).toStrictEqual({ error: 'No user with this Id' })
      })
      it('should return 200 and user on success', async () => {
        const userIdMock = 0
        const userMock: User.PersistedUser = {
          id: userIdMock,
          name: 'someName',
          email: 'someEmail',
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const getUserSpy = jest.fn().mockResolvedValue(userMock)
        const userRepository: UserInterface.Repository = {
          getUser: getUserSpy,
          createUser: jest.fn(),
          updateUser: jest.fn(),
          deleteUser: jest.fn()
        }

        const userRouterTest = userRouter.routes(userRepository)
        const app = testUtils.expressTest(userRouterTest)

        const result = await request(app).get(`/${userIdMock}`).send()
        const expectedResult = {
          id: userIdMock,
          name: userMock.name,
          email: userMock.email,
          createdAt: userMock.createdAt.toISOString(),
          updatedAt: userMock.updatedAt.toISOString()
        }

        expect(getUserSpy).toHaveBeenCalledWith(userIdMock)
        expect(result.status).toBe(200)
        expect(result.body).toStrictEqual(expectedResult)
      })
    })
    describe('method POST /', () => {
      it('should return 500 if use case throw an error', async () => {
        const createUserStub = jest.fn().mockRejectedValue(new Error())
        const userRepository: UserInterface.Repository = {
          getUser: jest.fn(),
          createUser: createUserStub,
          updateUser: jest.fn(),
          deleteUser: jest.fn()
        }
        const userRouterTest = userRouter.routes(userRepository)
        const app = testUtils.expressTest(userRouterTest)

        const result = await request(app).post('/').send()

        expect(result.status).toBe(500)
      })
      it('should return 409 if user email already exists', async () => {
        const nameMock = 'someName'
        const emailMock = 'someEmail'
        const createUserStub = jest
          .fn()
          .mockResolvedValue(
            UserInterface.CreateUserErrors.UserEmailAlreadyExists
          )

        const userRepository: UserInterface.Repository = {
          getUser: jest.fn(),
          createUser: createUserStub,
          updateUser: jest.fn(),
          deleteUser: jest.fn()
        }
        const userRouterTest = userRouter.routes(userRepository)
        const app = testUtils.expressTest(userRouterTest)
        const body = { name: nameMock, email: emailMock }

        const result = await request(app).post('/').send(body)

        expect(result.status).toBe(409)
        expect(result.body).toStrictEqual({
          error: 'User with this email already exists'
        })
      })
      it('should return 200 and user id on success', async () => {
        const userIdMock = 0
        const nameMock = 'someName'
        const emailMock = 'someEmail'

        const createUserSpy = jest.fn().mockResolvedValue(userIdMock)
        const userRepository: UserInterface.Repository = {
          getUser: jest.fn(),
          createUser: createUserSpy,
          updateUser: jest.fn(),
          deleteUser: jest.fn()
        }

        const userRouterTest = userRouter.routes(userRepository)
        const app = testUtils.expressTest(userRouterTest)
        const body = { name: nameMock, email: emailMock }

        const result = await request(app).post('/').send(body)
        const expectedResult = {
          id: userIdMock
        }

        expect(createUserSpy).toHaveBeenCalledWith(nameMock, emailMock)
        expect(result.status).toBe(200)
        expect(result.body).toStrictEqual(expectedResult)
      })
    })
    describe('method PUT /:id', () => {
      it('should return 500 if use case throw an error', async () => {
        const userIdMock = 0
        const updateUserStub = jest.fn().mockRejectedValue(new Error())
        const userRepository: UserInterface.Repository = {
          getUser: jest.fn(),
          createUser: jest.fn(),
          updateUser: updateUserStub,
          deleteUser: jest.fn()
        }
        const userRouterTest = userRouter.routes(userRepository)
        const app = testUtils.expressTest(userRouterTest)

        const result = await request(app).put(`/${userIdMock}`).send()

        expect(result.status).toBe(500)
      })
      it('should return 404 if user does not exists', async () => {
        const userIdMock = 0
        const nameMock = 'someName'
        const emailMock = 'someEmail'
        const updateUserStub = jest
          .fn()
          .mockResolvedValue(UserInterface.UpdateUserErrors.NoUserWithThisId)

        const userRepository: UserInterface.Repository = {
          getUser: jest.fn(),
          createUser: jest.fn(),
          updateUser: updateUserStub,
          deleteUser: jest.fn()
        }
        const userRouterTest = userRouter.routes(userRepository)
        const app = testUtils.expressTest(userRouterTest)
        const body = { name: nameMock, email: emailMock }

        const result = await request(app).put(`/${userIdMock}`).send(body)

        expect(result.status).toBe(404)
        expect(result.body).toStrictEqual({
          error: 'No user with this Id'
        })
      })
      it('should return 409 if user email already exists', async () => {
        const userIdMock = 0
        const nameMock = 'someName'
        const emailMock = 'someEmail'
        const updateUserStub = jest
          .fn()
          .mockResolvedValue(
            UserInterface.UpdateUserErrors.UserEmailAlreadyExists
          )

        const userRepository: UserInterface.Repository = {
          getUser: jest.fn(),
          createUser: jest.fn(),
          updateUser: updateUserStub,
          deleteUser: jest.fn()
        }
        const userRouterTest = userRouter.routes(userRepository)
        const app = testUtils.expressTest(userRouterTest)
        const body = { name: nameMock, email: emailMock }

        const result = await request(app).put(`/${userIdMock}`).send(body)

        expect(result.status).toBe(409)
        expect(result.body).toStrictEqual({
          error: 'User with this email already exists'
        })
      })
      it('should return 204 and nothing on success', async () => {
        const userIdMock = 0
        const nameMock = 'someName'
        const emailMock = 'someEmail'

        const updateUserSpy = jest.fn().mockResolvedValue(undefined)
        const userRepository: UserInterface.Repository = {
          getUser: jest.fn(),
          createUser: jest.fn(),
          updateUser: updateUserSpy,
          deleteUser: jest.fn()
        }

        const userRouterTest = userRouter.routes(userRepository)
        const app = testUtils.expressTest(userRouterTest)
        const body = { name: nameMock, email: emailMock }

        const result = await request(app).put(`/${userIdMock}`).send(body)

        expect(updateUserSpy).toHaveBeenCalledWith(
          userIdMock,
          nameMock,
          emailMock
        )
        expect(result.status).toBe(204)
      })
    })
    describe('method DELETE /:id', () => {
      it('should return 500 if use case throw an error', async () => {
        const userIdMock = 0
        const deleteUserStub = jest.fn().mockRejectedValue(new Error())
        const userRepository: UserInterface.Repository = {
          getUser: jest.fn(),
          createUser: jest.fn(),
          updateUser: jest.fn(),
          deleteUser: deleteUserStub
        }
        const userRouterTest = userRouter.routes(userRepository)
        const app = testUtils.expressTest(userRouterTest)

        const result = await request(app).delete(`/${userIdMock}`).send()

        expect(result.status).toBe(500)
      })
      it('should return 204 and nothing on success', async () => {
        const userIdMock = 0

        const deleteUserSpy = jest.fn().mockResolvedValue(userIdMock)
        const userRepository: UserInterface.Repository = {
          getUser: jest.fn(),
          createUser: jest.fn(),
          updateUser: jest.fn(),
          deleteUser: deleteUserSpy
        }

        const userRouterTest = userRouter.routes(userRepository)
        const app = testUtils.expressTest(userRouterTest)

        const result = await request(app).delete(`/${userIdMock}`).send()

        expect(deleteUserSpy).toHaveBeenCalledWith(userIdMock)
        expect(result.status).toBe(204)
      })
    })
  })
  describe('resourceRouter', () => {
    describe('method GET /:id', () => {
      it('should return 500 if use case throw an error', async () => {
        const resourceIdMock = 0
        const getResourceStub = jest.fn().mockRejectedValue(new Error())
        const resourceRepository: ResourceInterface.Repository = {
          createResource: jest.fn(),
          getResource: getResourceStub,
          deleteResource: jest.fn()
        }
        const resourceRouterTest = resourceRouter.routes(resourceRepository)
        const app = testUtils.expressTest(resourceRouterTest)

        const result = await request(app).get(`/${resourceIdMock}`).send()

        expect(result.status).toBe(500)
      })
      it('should return 404 if resource does not exists', async () => {
        const resourceIdMock = 0
        const getResourceStub = jest
          .fn()
          .mockResolvedValue(
            ResourceInterface.GetResourceErrors.NoRessourceWithThisId
          )
        const resourceRepository: ResourceInterface.Repository = {
          createResource: jest.fn(),
          getResource: getResourceStub,
          deleteResource: jest.fn()
        }
        const resourceRouterTest = resourceRouter.routes(resourceRepository)
        const app = testUtils.expressTest(resourceRouterTest)

        const result = await request(app).get(`/${resourceIdMock}`).send()

        expect(result.status).toBe(404)
        expect(result.body).toStrictEqual({ error: 'No resource with this Id' })
      })
      it('should return 200 and resource on success', async () => {
        const resourceIdMock = 0
        const resourceMock: Resource.PersistedResource = {
          id: resourceIdMock,
          publisher: 0,
          title: 'someTitle',
          content: 'someContent',
          publishedAt: new Date(),
          hit: 0
        }
        const getResourceSpy = jest.fn().mockResolvedValue(resourceMock)
        const resourceRepository: ResourceInterface.Repository = {
          createResource: jest.fn(),
          getResource: getResourceSpy,
          deleteResource: jest.fn()
        }
        const resourceRouterTest = resourceRouter.routes(resourceRepository)
        const app = testUtils.expressTest(resourceRouterTest)

        const result = await request(app).get(`/${resourceIdMock}`).send()
        const expectedResult = {
          id: resourceIdMock,
          publisher: resourceMock.publisher,
          title: resourceMock.title,
          content: resourceMock.content,
          publishedAt: resourceMock.publishedAt.toISOString(),
          hit: resourceMock.hit
        }

        expect(getResourceSpy).toHaveBeenCalledWith(resourceIdMock)
        expect(result.status).toBe(200)
        expect(result.body).toStrictEqual(expectedResult)
      })
    })
    describe('method POST /', () => {
      it('should return 500 if use case throw an error', async () => {
        const userIdMock = 0
        const titleMock = 'someTitle'
        const contentMock = 'someContent'
        const createResourceStub = jest.fn().mockRejectedValue(new Error())
        const resourceRepository: ResourceInterface.Repository = {
          createResource: createResourceStub,
          getResource: jest.fn(),
          deleteResource: jest.fn()
        }
        const resourceRouterTest = resourceRouter.routes(resourceRepository)
        const app = testUtils.expressTest(resourceRouterTest)

        const body = {
          userId: userIdMock,
          title: titleMock,
          content: contentMock
        }
        const result = await request(app).post('/').send(body)

        expect(result.status).toBe(500)
      })
      it('should return 404 if user does not exists', async () => {
        const userIdMock = 0
        const titleMock = 'someTitle'
        const contentMock = 'someContent'
        const createResourceStub = jest
          .fn()
          .mockResolvedValue(
            ResourceInterface.CreateResourceErrors.NoUserWithThisId
          )
        const resourceRepository: ResourceInterface.Repository = {
          createResource: createResourceStub,
          getResource: jest.fn(),
          deleteResource: jest.fn()
        }
        const resourceRouterTest = resourceRouter.routes(resourceRepository)
        const app = testUtils.expressTest(resourceRouterTest)

        const body = {
          userId: userIdMock,
          title: titleMock,
          content: contentMock
        }
        const result = await request(app).post('/').send(body)

        expect(result.status).toBe(404)
        expect(result.body).toStrictEqual({ error: 'No user with this Id' })
      })
      it('should return 200 and resource id on success', async () => {
        const userIdMock = 0
        const resourceIdMock = 0
        const titleMock = 'someTitle'
        const contentMock = 'someContent'
        const createResourceSpy = jest.fn().mockResolvedValue(resourceIdMock)
        const resourceRepository: ResourceInterface.Repository = {
          createResource: createResourceSpy,
          getResource: jest.fn(),
          deleteResource: jest.fn()
        }
        const resourceRouterTest = resourceRouter.routes(resourceRepository)
        const app = testUtils.expressTest(resourceRouterTest)

        const body = {
          userId: userIdMock,
          title: titleMock,
          content: contentMock
        }
        const result = await request(app).post('/').send(body)

        expect(createResourceSpy).toHaveBeenCalledWith(
          resourceIdMock,
          titleMock,
          contentMock
        )
        expect(result.status).toBe(200)
        expect(result.body).toStrictEqual({ id: resourceIdMock })
      })
    })
    describe('method DELETE /', () => {
      it('should return 500 if use case throw an error', async () => {
        const resourceIdMock = 0
        const deleteResourceStub = jest.fn().mockRejectedValue(new Error())
        const resourceRepository: ResourceInterface.Repository = {
          createResource: jest.fn(),
          getResource: jest.fn(),
          deleteResource: deleteResourceStub
        }
        const resourceRouterTest = resourceRouter.routes(resourceRepository)
        const app = testUtils.expressTest(resourceRouterTest)

        const result = await request(app).delete(`/${resourceIdMock}`).send()

        expect(result.status).toBe(500)
      })
      it('should return 204 and nothing on success', async () => {
        const resourceIdMock = 0
        const deleteResourceStub = jest.fn().mockResolvedValue(undefined)
        const resourceRepository: ResourceInterface.Repository = {
          createResource: jest.fn(),
          getResource: jest.fn(),
          deleteResource: deleteResourceStub
        }
        const resourceRouterTest = resourceRouter.routes(resourceRepository)
        const app = testUtils.expressTest(resourceRouterTest)

        const result = await request(app).delete(`/${resourceIdMock}`).send()

        expect(result.status).toBe(204)
      })
    })
  })
})

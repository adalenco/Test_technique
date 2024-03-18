import * as Resource from '@domain/resource/entities'
import * as User from '@domain/user/entities'

import { useCases } from './index'
import * as resourceEntities from './entities'

describe('use cases', () => {
  describe('createResource', () => {
    it('should return an error if user does not exists', async () => {
      const userIdMock = 0
      const titleMock = 'someTitle'
      const contentMock = 'someContent'

      const getOneUserByIdStub = jest.fn().mockResolvedValue(null)
      const cases = useCases(
        getOneUserByIdStub,
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn()
      )

      const result = await cases.createResource(
        userIdMock,
        titleMock,
        contentMock
      )
      const expectedResult =
        resourceEntities.CreateResourceErrors.NoUserWithThisId

      expect(result).toStrictEqual(expectedResult)
    })
    it('should return id on success', async () => {
      const userIdMock = 0
      const resourceIdMock = 0
      const titleMock = 'someTitle'
      const contentMock = 'someContent'
      const userMock: User.PersistedUser = {
        id: userIdMock,
        email: 'someMail',
        name: 'someName',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const getOneUserByIdStub = jest.fn().mockResolvedValue(userMock)
      const saveOneResourceStub = jest.fn().mockResolvedValue(resourceIdMock)
      const cases = useCases(
        getOneUserByIdStub,
        saveOneResourceStub,
        jest.fn(),
        jest.fn(),
        jest.fn()
      )

      const result = await cases.createResource(
        userIdMock,
        titleMock,
        contentMock
      )
      const expectedResult = expect.any(Number)

      expect(result).toStrictEqual(expectedResult)
    })
  })
  describe('getResource', () => {
    it('should return an error if resource does not exists', async () => {
      const resourceIdMock = 0

      const getOneResourceByIdStub = jest.fn().mockResolvedValue(null)
      const cases = useCases(
        jest.fn(),
        jest.fn(),
        getOneResourceByIdStub,
        jest.fn(),
        jest.fn()
      )

      const result = await cases.getResource(resourceIdMock)
      const expectedResult =
        resourceEntities.GetResourceErrors.NoRessourceWithThisId

      expect(result).toStrictEqual(expectedResult)
    })
    it('should return an error if user does not exists', async () => {
      const resourceIdMock = 0
      const resourceMock: Resource.PersistedResource = {
        id: resourceIdMock,
        title: 'someTitle',
        content: 'someContent',
        publisher: 0,
        publishedAt: new Date(),
        hit: 0
      }

      const getOneResourceByIdStub = jest.fn().mockResolvedValue(resourceMock)
      const emitResourceAccessEventSpy = jest.fn()
      const cases = useCases(
        jest.fn(),
        jest.fn(),
        getOneResourceByIdStub,
        jest.fn(),
        emitResourceAccessEventSpy
      )

      const result = await cases.getResource(resourceIdMock)
      const expectedResult = resourceMock

      expect(result).toStrictEqual(expectedResult)
      expect(emitResourceAccessEventSpy).toHaveBeenCalledWith(resourceIdMock)
    })
  })
  describe('deleteResource', () => {
    it('should return nothing on success', async () => {
      const resourceIdMock = 0
      const deleteOneResourceByIdStub = jest.fn().mockResolvedValue(undefined)
      const cases = useCases(
        jest.fn(),
        jest.fn(),
        jest.fn(),
        deleteOneResourceByIdStub,
        jest.fn()
      )

      const result = await cases.deleteResource(resourceIdMock)

      expect(result).toBeUndefined()
    })
  })
})

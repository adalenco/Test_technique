import * as User from '@domain/user/entities'

import { useCases } from './index'
import * as userEntities from './entities'

describe('use cases', () => {
  describe('getUser', () => {
    it('should return an error if user does not exists', async () => {
      const userIdMock = 0

      const getOneUserByIdStub = jest.fn().mockResolvedValue(null)
      const cases = useCases(
        getOneUserByIdStub,
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn()
      )

      const result = await cases.getUser(userIdMock)
      const expectedResult = userEntities.GetUserErrors.NoUserWithThisId

      expect(result).toStrictEqual(expectedResult)
    })
    it('should return user on success', async () => {
      const userIdMock = 0
      const userMock: User.PersistedUser = {
        id: userIdMock,
        email: 'someMail',
        name: 'someName',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const getOneUserByIdStub = jest.fn().mockResolvedValue(userMock)
      const cases = useCases(
        getOneUserByIdStub,
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn()
      )

      const result = await cases.getUser(userIdMock)
      const expectedResult = userMock

      expect(result).toStrictEqual(expectedResult)
    })
  })

  describe('create user', () => {
    it('should return an error if email already exists', async () => {
      const userIdMock = 0
      const userNameMock = 'someName'
      const userEmailMock = 'someEmail'
      const userMock: User.PersistedUser = {
        id: userIdMock,
        email: userEmailMock,
        name: userNameMock,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const getOneUserByEmailStub = jest.fn().mockResolvedValue(userMock)
      const cases = useCases(
        jest.fn(),
        getOneUserByEmailStub,
        jest.fn(),
        jest.fn(),
        jest.fn()
      )

      const result = await cases.createUser(userNameMock, userEmailMock)
      const expectedResult =
        userEntities.CreateUserErrors.UserEmailAlreadyExists
      expect(result).toStrictEqual(expectedResult)
    })
    it('should return the user id on success', async () => {
      const userIdMock = 0
      const userNameMock = 'someName'
      const userEmailMock = 'someEmail'

      const getOneUserByEmailStub = jest.fn().mockResolvedValue(null)
      const saveOneUserStub = jest.fn().mockResolvedValue(userIdMock)
      const cases = useCases(
        jest.fn(),
        getOneUserByEmailStub,
        jest.fn(),
        saveOneUserStub,
        jest.fn()
      )

      const result = await cases.createUser(userNameMock, userEmailMock)
      const expectedResult = userIdMock
      expect(result).toStrictEqual(expectedResult)
    })
  })

  describe('delete user', () => {
    it('should return nothing on success', async () => {
      const userIdMock = 0

      const deleteOneUserByIdSpy = jest.fn().mockResolvedValue(undefined)
      const cases = useCases(
        jest.fn(),
        jest.fn(),
        deleteOneUserByIdSpy,
        jest.fn(),
        jest.fn()
      )

      const result = await cases.deleteUser(userIdMock)
      expect(result).toBeUndefined()
      expect(deleteOneUserByIdSpy).toHaveBeenCalledWith(userIdMock)
    })
  })

  describe('update user', () => {
    it('should return an error if user does not exists', async () => {
      const userIdMock = 0
      const nameMock = 'someName'
      const emailMock = 'someEmail'

      const getOneUserByIdSpy = jest.fn().mockResolvedValue(null)
      const cases = useCases(
        getOneUserByIdSpy,
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn()
      )

      const result = await cases.updateUser(userIdMock, nameMock, emailMock)
      const expectedResult = userEntities.UpdateUserErrors.NoUserWithThisId
      expect(result).toStrictEqual(expectedResult)
      expect(getOneUserByIdSpy).toHaveBeenCalledWith(userIdMock)
    })
    it('should return an error if email already exists', async () => {
      const currentUserIdMock = 0
      const userWithSameEmailIdMock = 0
      const nameMock = 'someNewName'
      const emailMock = 'someOtherEmail'

      const currentUserMock: User.PersistedUser = {
        id: currentUserIdMock,
        email: 'someMail',
        name: 'someName',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const userWithSameEmailMock: User.PersistedUser = {
        id: userWithSameEmailIdMock,
        email: 'someOtherEmail',
        name: 'someOtherName',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const getOneUserByIdStub = jest.fn().mockResolvedValue(currentUserMock)
      const getOneUserByEmailSpy = jest
        .fn()
        .mockResolvedValue(userWithSameEmailMock)
      const cases = useCases(
        getOneUserByIdStub,
        getOneUserByEmailSpy,
        jest.fn(),
        jest.fn(),
        jest.fn()
      )

      const result = await cases.updateUser(
        currentUserIdMock,
        nameMock,
        emailMock
      )
      const expectedResult =
        userEntities.UpdateUserErrors.UserEmailAlreadyExists
      expect(result).toStrictEqual(expectedResult)
      expect(getOneUserByEmailSpy).toHaveBeenCalledWith(emailMock)
    })
    it('should return nothing on success', async () => {
      const userIdMock = 0
      const nameMock = 'someNewName'
      const emailMock = 'someOtherEmail'

      const userMock: User.PersistedUser = {
        id: userIdMock,
        email: 'someMail',
        name: 'someName',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const getOneUserByIdStub = jest.fn().mockResolvedValue(userMock)
      const getOneUserByEmailStub = jest.fn().mockResolvedValue(null)
      const updateOneUserSpy = jest.fn().mockResolvedValue(undefined)
      const cases = useCases(
        getOneUserByIdStub,
        getOneUserByEmailStub,
        jest.fn(),
        jest.fn(),
        updateOneUserSpy
      )

      const result = await cases.updateUser(userIdMock, nameMock, emailMock)
      expect(result).toBeUndefined()
      expect(updateOneUserSpy).toHaveBeenCalledWith({
        ...userMock,
        email: emailMock,
        name: nameMock
      })
    })
  })
})

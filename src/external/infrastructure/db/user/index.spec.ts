import type { Pool } from 'pg'

import * as testUtils from '../test_utils/index'
import type * as User from '@domain/user/entities'

import * as repository from '.'
import * as PgUser from './entities'

const databaseName = 'test_user'

beforeAll(async () => {
  await testUtils.createTestDatabase(databaseName)
})

afterAll(async () => {
  await testUtils.dropTestDatabase(databaseName)
})

const mockClientError: Partial<Pool> = {
  connect: jest.fn(() =>
    Promise.reject(new Error('Erreur de connexion à la base de données'))
  ),
  query: jest.fn(() =>
    Promise.reject(new Error('Erreur de connexion à la base de données'))
  )
}

const insertUser = async (pool: Pool, user: PgUser.PersistedUser) => {
  try {
    await pool.query('INSERT INTO public.users VALUES ($1, $2, $3, $4, $5)', [
      user.id,
      user.name,
      user.email,
      user.created_at,
      user.updated_at
    ])
  } catch (error) {
    throw new Error(`test insert error: ${error}`)
  }
}

const getUserById = async (
  pool: Pool,
  userId: PgUser.Id
): Promise<PgUser.PersistedUser> => {
  try {
    const result = await pool.query('SELECT * FROM public.users WHERE id=$1', [
      userId
    ])
    return result.rows[0]
  } catch (error) {
    throw new Error(`test insert error: ${error}`)
  }
}

describe('user postgresql requests', () => {
  describe('getOneUserById', () => {
    it('should throw an error on database error', async () => {
      const userIdMock = 0
      const getOneUserByIdTest = repository.getOneUserById(
        mockClientError as Pool
      )
      const result = getOneUserByIdTest(userIdMock)

      expect(result).rejects.toThrow(expect.any(Error))
    })

    it('should return null if no user with this id', async () => {
      const userIdMock = 0

      const testPool = await testUtils.connectUserTestDatabase(databaseName)
      const getOneUserByIdTest = repository.getOneUserById(testPool)

      const result = await getOneUserByIdTest(userIdMock)
      await testUtils.disconnectUserTestDatabase(testPool)
      const expectedResult = null
      expect(result).toStrictEqual(expectedResult)
    })

    it('should return user on success', async () => {
      const userIdMock = 0
      const userMock: PgUser.PersistedUser = {
        id: 0,
        name: 'someName',
        email: 'someEmail',
        created_at: new Date(),
        updated_at: new Date()
      }

      const testPool = await testUtils.connectUserTestDatabase(databaseName)
      await insertUser(testPool, userMock)
      const getOneUserByIdTest = repository.getOneUserById(testPool)

      const result = await getOneUserByIdTest(userIdMock)
      await testUtils.disconnectUserTestDatabase(testPool)
      const expectedResult = {
        id: userIdMock,
        name: userMock.name,
        email: userMock.email,
        createdAt: userMock.created_at,
        updatedAt: userMock.updated_at
      }
      expect(result).toStrictEqual(expectedResult)
    })
  })
  describe('getOneUserByEmail', () => {
    it('should throw an error on database error', async () => {
      const userEmailMock = 'someEmail'
      const getOneUserByEmailTest = repository.getOneUserByEmail(
        mockClientError as Pool
      )
      const result = getOneUserByEmailTest(userEmailMock)

      expect(result).rejects.toThrow(expect.any(Error))
    })

    it('should return null if no user with this email', async () => {
      const userEmailMock = 'someEmail'

      const testPool = await testUtils.connectUserTestDatabase(databaseName)
      const getOneUserByEmailTest = repository.getOneUserByEmail(testPool)

      const result = await getOneUserByEmailTest(userEmailMock)
      await testUtils.disconnectUserTestDatabase(testPool)
      const expectedResult = null
      expect(result).toStrictEqual(expectedResult)
    })

    it('should return user on success', async () => {
      const userEmailMock = 'someEmail'

      const userMock: PgUser.PersistedUser = {
        id: 0,
        name: 'someName',
        email: userEmailMock,
        created_at: new Date(),
        updated_at: new Date()
      }

      const testPool = await testUtils.connectUserTestDatabase(databaseName)
      await insertUser(testPool, userMock)
      const getOneUserByEmailTest = repository.getOneUserByEmail(testPool)

      const result = await getOneUserByEmailTest(userEmailMock)
      await testUtils.disconnectUserTestDatabase(testPool)
      const expectedResult = {
        id: userMock.id,
        name: userMock.name,
        email: userEmailMock,
        createdAt: userMock.created_at,
        updatedAt: userMock.updated_at
      }
      expect(result).toStrictEqual(expectedResult)
    })
  })
  describe('saveOneUser', () => {
    it('should throw an error on database error', async () => {
      const userMock: User.User = {
        name: 'someName',
        email: 'someEmail',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const saveOneUserTest = repository.saveOneUser(mockClientError as Pool)
      const result = saveOneUserTest(userMock)

      expect(result).rejects.toThrow(expect.any(Error))
    })

    it('should insert user and return id on success', async () => {
      const userMock: User.User = {
        name: 'someName',
        email: 'someEmail',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const testPool = await testUtils.connectUserTestDatabase(databaseName)
      const saveOneUserTest = repository.saveOneUser(testPool)

      const result = await saveOneUserTest(userMock)
      const insertedUser: PgUser.PersistedUser = await getUserById(
        testPool,
        result
      )
      await testUtils.disconnectUserTestDatabase(testPool)
      const expectedResult = {
        id: result,
        name: userMock.name,
        email: userMock.email,
        created_at: userMock.createdAt,
        updated_at: userMock.updatedAt
      }
      expect(insertedUser).toStrictEqual(expectedResult)
    })
  })
  describe('updateOneUser', () => {
    it('should throw an error on database error', async () => {
      const userMock: User.PersistedUser = {
        id: 0,
        name: 'someName',
        email: 'someEmail',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updateOneUserTest = repository.updateOneUser(
        mockClientError as Pool
      )
      const result = updateOneUserTest(userMock)

      expect(result).rejects.toThrow(expect.any(Error))
    })

    it('should update user and return nothing on success', async () => {
      const userIdMock = 0
      const userMock: PgUser.PersistedUser = {
        id: userIdMock,
        name: 'someName',
        email: 'someEmail',
        created_at: new Date(),
        updated_at: new Date()
      }
      const updatedUserMock: User.PersistedUser = {
        id: userIdMock,
        name: 'someNewName',
        email: 'someNewEmail',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const testPool = await testUtils.connectUserTestDatabase(databaseName)
      await insertUser(testPool, userMock)
      const updateOneUserTest = repository.updateOneUser(testPool)

      await updateOneUserTest(updatedUserMock)
      const updatedUser: PgUser.PersistedUser = await getUserById(
        testPool,
        userIdMock
      )
      await testUtils.disconnectUserTestDatabase(testPool)
      const expectedResult = {
        id: userIdMock,
        name: updatedUserMock.name,
        email: updatedUserMock.email,
        created_at: updatedUserMock.createdAt,
        updated_at: expect.any(Date)
      }
      expect(updatedUser).toStrictEqual(expectedResult)
    })
  })
  describe('deleteOneUser', () => {
    it('should throw an error on database error', async () => {
      const userIdMock = 0

      const deleteOneUserTest = repository.deleteOneUser(
        mockClientError as Pool
      )
      const result = deleteOneUserTest(userIdMock)

      expect(result).rejects.toThrow(expect.any(Error))
    })

    it('should return nothing on success', async () => {
      const userIdMock = 0
      const userMock: PgUser.PersistedUser = {
        id: userIdMock,
        name: 'someName',
        email: 'someEmail',
        created_at: new Date(),
        updated_at: new Date()
      }

      const testPool = await testUtils.connectUserTestDatabase(databaseName)
      await insertUser(testPool, userMock)
      const deleteOneUserUserTest = repository.deleteOneUser(testPool)

      await deleteOneUserUserTest(userIdMock)
      const deletedUser = await getUserById(testPool, userIdMock)
      await testUtils.disconnectUserTestDatabase(testPool)
      expect(deletedUser).toBeUndefined()
    })
  })
})

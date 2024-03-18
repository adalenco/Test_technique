import type { Pool } from 'pg'

import * as testUtils from '../test_utils/index'
import type * as Resource from '@domain/resource/entities'

import * as repository from '.'
import * as PgResource from './entities'
import * as PgUser from '../user/entities'

const databaseName = 'test_resource'

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

const insertResource = async (
  pool: Pool,
  resource: PgResource.PersistedResource
) => {
  try {
    await pool.query(
      'INSERT INTO public.resources VALUES ($1, $2, $3, $4, $5, $6)',
      [
        resource.id,
        resource.user_id,
        resource.title,
        resource.content,
        resource.created_at,
        resource.hit
      ]
    )
  } catch (error) {
    throw new Error(`test insert error: ${error}`)
  }
}

const getResourceById = async (
  pool: Pool,
  resourceId: PgResource.Id
): Promise<PgResource.PersistedResource> => {
  try {
    const result = await pool.query(
      'SELECT * FROM public.resources WHERE id=$1',
      [resourceId]
    )
    return result.rows[0]
  } catch (error) {
    throw new Error(`test insert error: ${error}`)
  }
}

describe('resource postgresql requests', () => {
  describe('getOneResourceById', () => {
    it('should throw an error on database error', async () => {
      const resourceIdMock = 0
      const getOneResourceByIdTest = repository.getOneResourceById(
        mockClientError as Pool
      )
      const result = getOneResourceByIdTest(resourceIdMock)

      expect(result).rejects.toThrow(expect.any(Error))
    })

    it('should return null if no resource with this id', async () => {
      const resourceIdMock = 0

      const testPool = await testUtils.connectResourceTestDatabase(databaseName)
      const getOneResourceByIdTest = repository.getOneResourceById(testPool)

      const result = await getOneResourceByIdTest(resourceIdMock)
      await testUtils.disconnectResourceTestDatabase(testPool)
      const expectedResult = null
      expect(result).toStrictEqual(expectedResult)
    })

    it('should return resource on success', async () => {
      const userIdMock = 0
      const resourceIdMock = 0
      const userMock: PgUser.PersistedUser = {
        id: 0,
        name: 'someName',
        email: 'someEmail',
        created_at: new Date(),
        updated_at: new Date()
      }
      const resourceMock: PgResource.PersistedResource = {
        id: resourceIdMock,
        user_id: userIdMock,
        title: 'someTitle',
        content: 'someContent',
        created_at: new Date(),
        hit: 0
      }

      const testPool = await testUtils.connectResourceTestDatabase(databaseName)
      await insertUser(testPool, userMock)
      await insertResource(testPool, resourceMock)
      const getOneResourceByIdTest = repository.getOneResourceById(testPool)

      const result = await getOneResourceByIdTest(userIdMock)
      await testUtils.disconnectResourceTestDatabase(testPool)
      const expectedResult: Resource.PersistedResource = {
        id: resourceIdMock,
        publisher: userIdMock,
        title: resourceMock.title,
        content: resourceMock.content,
        publishedAt: resourceMock.created_at,
        hit: resourceMock.hit
      }
      expect(result).toStrictEqual(expectedResult)
    })
  })
  describe('saveOneResource', () => {
    it('should throw an error on database error', async () => {
      const resourceMock: Resource.Resource = {
        publisher: 0,
        title: 'someTitle',
        content: 'someContent',
        publishedAt: new Date(),
        hit: 0
      }
      const saveOneResourceTest = repository.saveOneResource(
        mockClientError as Pool
      )
      const result = saveOneResourceTest(resourceMock)

      expect(result).rejects.toThrow(expect.any(Error))
    })

    it('should throw an error if user does not exists', async () => {
      const resourceMock: Resource.Resource = {
        publisher: 0,
        title: 'someTitle',
        content: 'someContent',
        publishedAt: new Date(),
        hit: 0
      }

      const testPool = await testUtils.connectResourceTestDatabase(databaseName)
      const saveOneResourceTest = repository.saveOneResource(testPool)

      const result = saveOneResourceTest(resourceMock)

      expect(result).rejects.toThrow(expect.any(Error))
      await testUtils.disconnectResourceTestDatabase(testPool)
    })

    it('should insert resource and return resource id on success', async () => {
      const userIdMock = 0
      const userMock: PgUser.PersistedUser = {
        id: 0,
        name: 'someName',
        email: 'someEmail',
        created_at: new Date(),
        updated_at: new Date()
      }
      const resourceMock: Resource.Resource = {
        publisher: userIdMock,
        title: 'someTitle',
        content: 'someContent',
        publishedAt: new Date(),
        hit: 0
      }

      const testPool = await testUtils.connectResourceTestDatabase(databaseName)
      await insertUser(testPool, userMock)
      const saveOneResourceTest = repository.saveOneResource(testPool)

      const result = await saveOneResourceTest(resourceMock)
      const insertedResource = await getResourceById(testPool, result)
      await testUtils.disconnectResourceTestDatabase(testPool)

      const expectedResult: PgResource.PersistedResource = {
        id: result,
        user_id: userIdMock,
        title: resourceMock.title,
        content: resourceMock.content,
        created_at: resourceMock.publishedAt,
        hit: resourceMock.hit
      }
      expect(insertedResource).toStrictEqual(expectedResult)
    })
  })
  describe('updateOneResource', () => {
    it('should throw an error on database error', async () => {
      const resourceMock: Resource.PersistedResource = {
        id: 0,
        publisher: 0,
        title: 'someTitle',
        content: 'someContent',
        publishedAt: new Date(),
        hit: 0
      }
      const updateOneResourceTest = repository.updateOneResource(
        mockClientError as Pool
      )
      const result = updateOneResourceTest(resourceMock)

      expect(result).rejects.toThrow(expect.any(Error))
    })

    it('should update resource return nothing on success', async () => {
      const userIdMock = 0
      const resourceIdMock = 0
      const userMock: PgUser.PersistedUser = {
        id: 0,
        name: 'someName',
        email: 'someEmail',
        created_at: new Date(),
        updated_at: new Date()
      }
      const resourceMock: PgResource.PersistedResource = {
        id: resourceIdMock,
        user_id: userIdMock,
        title: 'someTitle',
        content: 'someContent',
        created_at: new Date(),
        hit: 0
      }
      const updatedResourceMock: Resource.PersistedResource = {
        id: resourceIdMock,
        publisher: userIdMock,
        title: 'someNewTitle',
        content: 'someNewContent',
        publishedAt: new Date(),
        hit: 1
      }

      const testPool = await testUtils.connectResourceTestDatabase(databaseName)
      await insertUser(testPool, userMock)
      await insertResource(testPool, resourceMock)
      const updateOneResourceTest = repository.updateOneResource(testPool)

      await updateOneResourceTest(updatedResourceMock)
      const updatedResource = await getResourceById(testPool, resourceIdMock)
      await testUtils.disconnectResourceTestDatabase(testPool)

      const expectedResult: PgResource.PersistedResource = {
        id: resourceIdMock,
        user_id: userIdMock,
        title: updatedResourceMock.title,
        content: updatedResourceMock.content,
        created_at: updatedResourceMock.publishedAt,
        hit: updatedResourceMock.hit
      }
      expect(updatedResource).toStrictEqual(expectedResult)
    })
  })
  describe('deleteOneResource', () => {
    it('should throw an error on database error', async () => {
      const resourceIdMock = 0

      const deleteOneResourceTest = repository.deleteOneResource(
        mockClientError as Pool
      )
      const result = deleteOneResourceTest(resourceIdMock)

      expect(result).rejects.toThrow(expect.any(Error))
    })

    it('should return nothing on success', async () => {
      const userIdMock = 0
      const resourceIdMock = 0
      const userMock: PgUser.PersistedUser = {
        id: userIdMock,
        name: 'someName',
        email: 'someEmail',
        created_at: new Date(),
        updated_at: new Date()
      }
      const resourceMock: PgResource.PersistedResource = {
        id: resourceIdMock,
        user_id: userIdMock,
        title: 'someTitle',
        content: 'someContent',
        created_at: new Date(),
        hit: 0
      }

      const testPool = await testUtils.connectResourceTestDatabase(databaseName)
      await insertUser(testPool, userMock)
      await insertResource(testPool, resourceMock)
      const deleteOneResourceTest = repository.deleteOneResource(testPool)

      await deleteOneResourceTest(userIdMock)
      const deletedResource = await getResourceById(testPool, resourceIdMock)
      await testUtils.disconnectResourceTestDatabase(testPool)
      expect(deletedResource).toBeUndefined()
    })
  })
})

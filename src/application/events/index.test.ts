import * as Resource from '@domain/resource/entities'

import { useCases } from './index'
import * as eventsEntities from './entities'

describe('use cases', () => {
  describe('incrementResourceHit', () => {
    it('should return an error if resource does not exists', async () => {
      const resourceIdMock = 0

      const getOneResourceByIdStub = jest.fn().mockResolvedValue(null)
      const cases = useCases(getOneResourceByIdStub, jest.fn())

      const result = await cases.incrementResourceHit(resourceIdMock)
      const expectedResult =
        eventsEntities.IncrementResourceHitErrors.NoRessourceWithThisId

      expect(result).toStrictEqual(expectedResult)
    })
    it('should return updated hit on success', async () => {
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
      const updateOneResourceSpy = jest.fn()
      const cases = useCases(getOneResourceByIdStub, updateOneResourceSpy)

      const result = await cases.incrementResourceHit(resourceIdMock)
      const expectedResult = resourceMock.hit + 1
      const expectedResourceUpdate = {
        ...resourceMock,
        hit: resourceMock.hit + 1
      }

      expect(result).toStrictEqual(expectedResult)
      expect(updateOneResourceSpy).toHaveBeenCalledWith(expectedResourceUpdate)
    })
  })
})

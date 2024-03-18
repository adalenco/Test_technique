import type { EventEmitter } from 'events'

import type * as Resource from '@domain/resource/entities'
import type * as ResourceRepository from '@domain/resource/index'

import type * as Events from './entities'
import { IncrementResourceHitErrors } from './entities'

const RESOURCE_ACCESS_EVENT = 'RESOURCE_ACCESS_EVENT'

const emitResourceAccessEvent =
  (eventHandler: EventEmitter) => (id: Resource.Id) => {
    try {
      eventHandler.emit(RESOURCE_ACCESS_EVENT, id)
    } catch (error) {
      throw new Error(
        `Error firing RESOURCE_ACCESS_EVENT: ${JSON.stringify(error)}`
      )
    }
  }

const useCases = (
  getOneResourceById: ResourceRepository.GetOneResourceById,
  updateOneResource: ResourceRepository.UpdateOneResource
): Events.Repository => ({
  incrementResourceHit: async (id) => {
    const resource = await getOneResourceById(id)
    if (resource === null) {
      return IncrementResourceHitErrors.NoRessourceWithThisId
    }
    const newResource = { ...resource, hit: resource.hit + 1 }
    await updateOneResource(newResource)
    return newResource.hit
  }
})

export { RESOURCE_ACCESS_EVENT, emitResourceAccessEvent, useCases }

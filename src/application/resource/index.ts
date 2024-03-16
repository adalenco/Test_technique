import type * as ResourceRepository from '@domain/resource/repository'
import type * as UserRepository from '@domain/user/repository'
import type * as EventRepository from '@domain/event/repository'

import type * as UseCases from './entities'
import {
  CreateResourceErrors,
  GetResourceErrors,
  IncrementResourceHitErrors
} from './entities'
import * as factories from './factories'

export const useCases = (
  getOneUserById: UserRepository.GetOneUserById,
  saveOneResource: ResourceRepository.SaveOneResource,
  getOneResourceById: ResourceRepository.GetOneResourceById,
  deleteOneResourceById: ResourceRepository.DeleteOneResourceById,
  updateOneResource: ResourceRepository.UpdateOneResource,
  emitResourceAccessEvent: EventRepository.EmitResourceAccessEvent
): UseCases.Repository => ({
  createResource: async (userId, title, content) => {
    const user = await getOneUserById(userId)
    if (user === null) {
      return CreateResourceErrors.NoUserWithThisId
    }
    const resource = factories.resourceFactory(userId, title, content, 0)
    const id = await saveOneResource(resource)
    return id
  },

  deleteResource: async (id) => {
    await deleteOneResourceById(id)
  },

  getRessource: async (id) => {
    const resource = await getOneResourceById(id)
    if (resource === null) {
      return GetResourceErrors.NoRessourceWithThisId
    }
    emitResourceAccessEvent(resource.id)
    return resource
  },

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

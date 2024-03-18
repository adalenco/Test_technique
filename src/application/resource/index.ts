import type * as ResourceRepository from '@domain/resource/index'
import type * as UserRepository from '@domain/user'
import type * as EventRepository from '@domain/event'

import type * as UseCases from './entities'
import { CreateResourceErrors, GetResourceErrors } from './entities'
import * as factories from './factories'

export const useCases = (
  getOneUserById: UserRepository.GetOneUserById,
  saveOneResource: ResourceRepository.SaveOneResource,
  getOneResourceById: ResourceRepository.GetOneResourceById,
  deleteOneResourceById: ResourceRepository.DeleteOneResourceById,
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

  getResource: async (id) => {
    const resource = await getOneResourceById(id)
    if (resource === null) {
      return GetResourceErrors.NoRessourceWithThisId
    }
    emitResourceAccessEvent(resource.id)
    return resource
  }
})

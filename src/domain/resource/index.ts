import type * as Resource from './entities'

type SaveOneResource = (resource: Resource.Resource) => Promise<Resource.Id>

type UpdateOneResource = (resource: Resource.PersistedResource) => Promise<void>

type DeleteOneResourceById = (id: Resource.Id) => Promise<void>

type GetOneResourceById = (
  id: Resource.Id
) => Promise<null | Resource.PersistedResource>

export type {
  SaveOneResource,
  UpdateOneResource,
  DeleteOneResourceById,
  GetOneResourceById
}

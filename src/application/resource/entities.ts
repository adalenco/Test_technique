import type * as User from '@domain/user/entities'
import type * as Resource from '@domain/resource/entities'

enum CreateResourceErrors {
  NoUserWithThisId = 'No user with this Id'
}
enum GetResourceErrors {
  NoRessourceWithThisId = 'No resource with this id'
}
enum IncrementResourceHitErrors {
  NoRessourceWithThisId = 'No resource with this id'
}

type CreateResource = (
  userId: User.Id,
  title: Resource.Title,
  content: Resource.Content
) => Promise<CreateResourceErrors | Resource.Id>

type DeleteResource = (id: Resource.Id) => Promise<void>

type GetResource = (
  id: Resource.Id
) => Promise<GetResourceErrors | Resource.Resource>

type IncrementResourceHit = (
  id: Resource.Id
) => Promise<IncrementResourceHitErrors | Resource.Hit>

interface Repository {
  createResource: CreateResource
  deleteResource: DeleteResource
  getRessource: GetResource
  incrementResourceHit: IncrementResourceHit
}

export type {
  Repository,
  IncrementResourceHit,
  GetResource,
  DeleteResource,
  CreateResource
}

export { IncrementResourceHitErrors, GetResourceErrors, CreateResourceErrors }

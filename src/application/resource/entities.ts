import type * as User from '@domain/user/entities'
import type * as Resource from '@domain/resource/entities'

enum CreateResourceErrors {
  NoUserWithThisId = 'No user with this Id'
}
enum GetResourceErrors {
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

interface Repository {
  createResource: CreateResource
  deleteResource: DeleteResource
  getRessource: GetResource
}

export type { Repository, GetResource, DeleteResource, CreateResource }

export { GetResourceErrors, CreateResourceErrors }

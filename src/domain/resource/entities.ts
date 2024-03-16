import type * as User from '../user/entities'

type Id = number
type Title = string
type Content = string
type Hit = number

type Resource = {
  publisher: User.Id
  title: Title
  content: Content
  publishedAt: Date
  hit: Hit
}

type PersistedResource = Resource & { id: Id }

export type { Id, Title, Content, Resource, PersistedResource, Hit }

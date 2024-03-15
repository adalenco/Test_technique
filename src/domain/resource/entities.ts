import type * as User from '../user/entities'

type Id = string
type Title = string
type Content = string
type Hit = number

type Resource = {
  id: Id
  publisher: User.Id
  title: Title
  content: Content
  publishedAt: Date
  hit: Hit
}

export type { Id, Title, Content, Resource, Hit }

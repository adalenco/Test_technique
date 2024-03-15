import { v4 as uuidv4 } from 'uuid'

import type * as Resource from '../../domain/resource/entities'
import type * as User from '../../domain/user/entities'

export const resourceFactory = (
  publisher: User.Id,
  title: Resource.Title,
  content: Resource.Content,
  hit: Resource.Hit
): Resource.Resource => ({
  id: uuidv4(),
  publisher,
  title,
  content,
  publishedAt: new Date(),
  hit
})

import type * as Resource from '../resource/entities'

export type EmitResourceAccessEvent = (id: Resource.Id) => void

import { Array } from '@effect-ts/core'
import { Film } from '../../app/arcadia/Film'

export interface FilmService {
  readonly create: (film: Film) => Promise<void>
  readonly getMany: () => Promise<Array.Array<Film>>
}

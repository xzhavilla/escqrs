import { Array } from '@effect-ts/core'
import { Screen } from '../../app/arcadia/Screen'

export interface ScreenService {
  readonly create: (film: Screen) => Promise<void>
  readonly getMany: () => Promise<Array.Array<Screen>>
}

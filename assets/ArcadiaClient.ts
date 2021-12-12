import { Array } from '@effect-ts/core'
import { Film } from '../app/arcadia/film/Film'
import { Screen } from '../app/arcadia/screen/Screen'
import { Screening } from '../app/arcadia/screening/Screening'
import { DeepPartial } from '../src/DeepPartial'
import { Body, Header, Id } from '../src/entity/Entity'

export interface ArcadiaClient {
  readonly createScreen: (
    screen: { _: Pick<Header<Screen>, 'id'> } & Body<Screen>,
  ) => Promise<Screen>
  readonly getScreens: () => Promise<Array.Array<Screen>>
  readonly getScreen: (id: Id<Screen>) => Promise<Screen>
  readonly editScreen: (
    screen: {
      _: Pick<Header<Screen>, 'id'>
    } & DeepPartial<Body<Screen>>,
  ) => Promise<Screen>
  readonly removeScreen: (id: Id<Screen>) => Promise<void>
  readonly createFilm: (film: Film) => Promise<Film>
  readonly getFilms: () => Promise<Array.Array<Film>>
  readonly getFilm: (id: Id<Film>) => Promise<Film>
  readonly editFilm: (
    film: { _: Pick<Header<Film>, 'id'> } & DeepPartial<Body<Film>>,
  ) => Promise<Film>
  readonly removeFilm: (id: Id<Film>) => Promise<void>
  readonly createScreening: (
    screeningId: Id<Screening>,
    filmId: Id<Film>,
    screenId: Id<Screen>,
    date: Date,
  ) => Promise<Screening>
}

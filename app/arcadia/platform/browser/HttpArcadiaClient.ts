import { Effect, pipe } from '@effect-ts/core'
import { Clock, HasClock } from '@effect-ts/system/Clock'
import { gen } from '@effect-ts/system/Effect'
import * as t from 'io-ts'
import { $Any } from '../../../../src/Any'
import {
  $HttpClient,
  HasHttpClient,
  HttpClient,
} from '../../../../src/http/client/HttpClient'
import { HasLogger, Logger } from '../../../../src/logger/Logger'
import { $FilmC } from '../../film/Film'
import { $ScreeningsByFilmC } from '../../projection/ScreeningsByFilm'
import { $ScreenC } from '../../screen/Screen'
import { ArcadiaClient } from './ArcadiaClient'

export const $HttpArcadiaClient =
  ({
    $clock,
    $http,
    $logger,
  }: {
    $clock: Clock
    $http: HttpClient
    $logger: Logger
  }) =>
  (url: string): ArcadiaClient => ({
    createFilm: (id, title) =>
      pipe(
        $HttpClient.post(`${url}/api/v1/films/${id}/create`, {
          body: { data: { title } },
          json: true,
        }),
        Effect.asUnit,
        Effect.provideService(HasClock)($clock),
        Effect.provideService(HasHttpClient)($http),
        Effect.provideService(HasLogger)($logger),
        Effect.runPromise,
      ),
    editFilm: (id, body) =>
      pipe(
        $HttpClient.post(`${url}/api/v1/films/${id}/edit`, {
          body: { data: body },
          json: true,
        }),
        Effect.asUnit,
        Effect.provideService(HasClock)($clock),
        Effect.provideService(HasHttpClient)($http),
        Effect.provideService(HasLogger)($logger),
        Effect.runPromise,
      ),
    removeFilm: (id) =>
      pipe(
        $HttpClient.post(`${url}/api/v1/films/${id}/remove`, { json: true }),
        Effect.asUnit,
        Effect.provideService(HasClock)($clock),
        Effect.provideService(HasHttpClient)($http),
        Effect.provideService(HasLogger)($logger),
        Effect.runPromise,
      ),
    getFilms: () =>
      pipe(
        gen(function* (_) {
          const response = yield* _(
            $HttpClient.get(`${url}/api/v1/films`, { json: true }),
          )
          const body = yield* _(
            $Any.decode(t.type({ data: t.readonlyArray($FilmC) }))(
              response.body,
            ),
          )

          return body.data
        }),
        Effect.provideService(HasClock)($clock),
        Effect.provideService(HasHttpClient)($http),
        Effect.provideService(HasLogger)($logger),
        Effect.runPromise,
      ),
    getFilm: (id) =>
      pipe(
        gen(function* (_) {
          const response = yield* _(
            $HttpClient.get(`${url}/api/v1/films/${id}`, { json: true }),
          )
          const body = yield* _(
            $Any.decode(t.type({ data: $FilmC }))(response.body),
          )

          return body.data
        }),
        Effect.provideService(HasClock)($clock),
        Effect.provideService(HasHttpClient)($http),
        Effect.provideService(HasLogger)($logger),
        Effect.runPromise,
      ),
    createScreen: (id, body) =>
      pipe(
        gen(function* (_) {
          const response = yield* _(
            $HttpClient.post(`${url}/api/v1/screens`, {
              body: { data: { ...body, _: { id } } },
              json: true,
            }),
          )
          const _body = yield* _(
            $Any.decode(t.type({ data: $ScreenC }))(response.body),
          )

          return _body.data
        }),
        Effect.provideService(HasClock)($clock),
        Effect.provideService(HasHttpClient)($http),
        Effect.provideService(HasLogger)($logger),
        Effect.runPromise,
      ),
    editScreen: (id, body) =>
      pipe(
        gen(function* (_) {
          const response = yield* _(
            $HttpClient.patch(`${url}/api/v1/screens/${id}`, {
              body: { data: body },
              json: true,
            }),
          )
          const _body = yield* _(
            $Any.decode(t.type({ data: $ScreenC }))(response.body),
          )

          return _body.data
        }),
        Effect.provideService(HasClock)($clock),
        Effect.provideService(HasHttpClient)($http),
        Effect.provideService(HasLogger)($logger),
        Effect.runPromise,
      ),
    removeScreen: (id) =>
      pipe(
        $HttpClient.delete(`${url}/api/v1/screens/${id}`, {
          json: true,
        }),
        Effect.asUnit,
        Effect.provideService(HasClock)($clock),
        Effect.provideService(HasHttpClient)($http),
        Effect.provideService(HasLogger)($logger),
        Effect.runPromise,
      ),
    getScreens: () =>
      pipe(
        gen(function* (_) {
          const response = yield* _(
            $HttpClient.get(`${url}/api/v1/screens`, { json: true }),
          )
          const body = yield* _(
            $Any.decode(t.type({ data: t.readonlyArray($ScreenC) }))(
              response.body,
            ),
          )

          return body.data
        }),
        Effect.provideService(HasClock)($clock),
        Effect.provideService(HasHttpClient)($http),
        Effect.provideService(HasLogger)($logger),
        Effect.runPromise,
      ),
    getScreen: (id) =>
      pipe(
        gen(function* (_) {
          const response = yield* _(
            $HttpClient.get(`${url}/api/v1/screens/${id}`, { json: true }),
          )
          const body = yield* _(
            $Any.decode(t.type({ data: $ScreenC }))(response.body),
          )

          return body.data
        }),
        Effect.provideService(HasClock)($clock),
        Effect.provideService(HasHttpClient)($http),
        Effect.provideService(HasLogger)($logger),
        Effect.runPromise,
      ),
    createScreening: (screeningId, filmId, screenId, date) =>
      pipe(
        $HttpClient.post(`${url}/api/v1/screenings/${screeningId}/create`, {
          body: { data: { filmId, screenId, date } },
          json: true,
        }),
        Effect.asUnit,
        Effect.provideService(HasClock)($clock),
        Effect.provideService(HasHttpClient)($http),
        Effect.provideService(HasLogger)($logger),
        Effect.runPromise,
      ),
    getScreeningsByFilm: () =>
      pipe(
        gen(function* (_) {
          const response = yield* _(
            $HttpClient.get(`${url}/api/v1/screenings-by-film`, {
              json: true,
            }),
          )
          const body = yield* _(
            $Any.decode(t.type({ data: t.readonlyArray($ScreeningsByFilmC) }))(
              response.body,
            ),
          )

          return body.data
        }),
        Effect.provideService(HasClock)($clock),
        Effect.provideService(HasHttpClient)($http),
        Effect.provideService(HasLogger)($logger),
        Effect.runPromise,
      ),
  })

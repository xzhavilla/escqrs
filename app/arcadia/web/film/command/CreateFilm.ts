import { gen } from '@effect-ts/system/Effect'
import * as t from 'io-ts'
import { $Film, $FilmC } from '../../../Film'
import { $Fastify } from '../../Fastify'

export const $CreateFilm = $Fastify.post(
  '/api/v1/films',
  {
    body: t.type({
      data: t.strict({ _: t.strict({ id: t.string }), title: t.string }),
    }),
    response: t.type({ data: $FilmC }),
  },
  async (request) =>
    gen(function* (_) {
      const film = yield* _(
        $Film()(request.body.data, {
          id: $Film.id(request.body.data._.id),
        }),
      )
      yield* _($Film.save(film))

      return { data: yield* _($Film.load(film._.id)) }
    }),
)

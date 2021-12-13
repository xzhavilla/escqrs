import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  TextField,
} from '@mui/material'
import React, { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { $Film } from '../../../../film/Film'
import { $Screen } from '../../../../screen/Screen'
import { FilmsAndScreensNotFetched } from '../../error/FilmsAndScreensNotFetched'
import { use$Dispatch, use$Selector } from '../../Hook'
import { ScreeningNotCreated } from '../error/ScreeningNotCreated'
import { $ScreeningCreation, $ScreeningCreationSlice } from './creation/slice'

export const ScreenUpsertion: FC = () => {
  const dispatch = use$Dispatch()
  const navigate = useNavigate()

  const state = use$Selector(
    (state) => state[$ScreeningCreationSlice.name].state,
  )
  const error = use$Selector(
    (state) => state[$ScreeningCreationSlice.name].error,
  )
  const films = use$Selector(
    (state) => state[$ScreeningCreationSlice.name].films,
  )
  const screens = use$Selector(
    (state) => state[$ScreeningCreationSlice.name].screens,
  )

  const [filmId, setFilmId] = useState<string>()
  const [screenId, setScreenId] = useState<string>()
  const [date, setDate] = useState<Date>()

  useEffect(() => {
    dispatch($ScreeningCreation.start())
    return () => {
      dispatch($ScreeningCreation.stop())
    }
  }, [])

  return (
    <>
      <Dialog open>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (
              undefined === filmId ||
              undefined === screenId ||
              undefined === date
            ) {
              return
            }

            dispatch(
              $ScreeningCreation.createScreening({
                filmId: $Film.id(filmId),
                screenId: $Screen.id(screenId),
                date,
              }),
            )
          }}
        >
          <DialogTitle>Create screening</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {error && (
                <Grid item xs={12}>
                  <Alert
                    action={
                      error instanceof FilmsAndScreensNotFetched ? (
                        <Button
                          color="inherit"
                          disabled={'FetchingFilmsAndScreens' === state}
                          size="small"
                          onClick={() =>
                            dispatch($ScreeningCreation.fetchFilmsAndScreens())
                          }
                        >
                          Retry
                        </Button>
                      ) : null
                    }
                    severity="error"
                  >
                    {error instanceof ScreeningNotCreated
                      ? 'Cannot create screening.'
                      : error instanceof FilmsAndScreensNotFetched
                      ? 'Cannot fetch films and/or screens.'
                      : undefined}
                  </Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  disabled={undefined !== state}
                  fullWidth
                  label="Film"
                  name="film"
                  required
                  variant="filled"
                  value={filmId}
                  onChange={(event) => setFilmId(event.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={undefined !== state}
                  fullWidth
                  label="Screen"
                  name="screen"
                  required
                  type="number"
                  variant="filled"
                  value={screenId}
                  onChange={(event) => setScreenId(event.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={undefined !== state}
                  fullWidth
                  inputProps={{ min: 1, max: 1000 }}
                  label="Date"
                  name="date"
                  required
                  type="number"
                  variant="filled"
                  value={date}
                  onChange={(event) => setDate(new Date(event.target.value))}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              disabled={undefined !== state}
              type="submit"
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={undefined !== state}
        message={
          state &&
          {
            CreatingScreening: 'Creating screening...',
            FetchingFilmsAndScreens: 'Fetching films and screens...',
          }[state]
        }
      />
    </>
  )
}
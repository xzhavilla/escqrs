import { Add } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Fab,
  Grid,
  Paper,
  Skeleton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import React, { FC, useEffect } from 'react'
import { Outlet } from 'react-router'
import { Link } from 'react-router-dom'
import { use$Dispatch, use$Selector } from './Hook'
import { ScreenList } from './ScreenListSlice'

export const ScreenListUI: FC = () => {
  const dispatch = use$Dispatch()

  const isLoading = use$Selector((state) => state.ScreenList.isLoading)
  const error = use$Selector((state) => state.ScreenList.error)
  const screens = use$Selector((state) => state.ScreenList.screens)

  useEffect(() => {
    dispatch(ScreenList.Start())
    return () => {
      dispatch(ScreenList.Stop())
    }
  }, [])

  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">Screens</Typography>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Alert
                action={
                  <Button
                    color="inherit"
                    disabled={isLoading}
                    size="small"
                    onClick={() => dispatch(ScreenList.Fetch())}
                  >
                    Retry
                  </Button>
                }
                severity="error"
              >
                Cannot update list of screens.
              </Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 'calc(100% * 2 / 3)' }}>
                      Name
                    </TableCell>
                    <TableCell align="right">Seats</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(screens ?? [null, null, null]).map((screen, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {screen ? screen.name : <Skeleton variant="text" />}
                      </TableCell>
                      <TableCell align="right">
                        {screen ? screen.seats : <Skeleton variant="text" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Fab
          color="primary"
          component={Link}
          disabled={isLoading}
          to="new"
          variant="extended"
          sx={{ bottom: 16, position: 'absolute', right: 16 }}
        >
          <Add sx={{ mr: 1 }} /> Screen
        </Fab>
      </Box>
      <Outlet />
      <Snackbar open={isLoading} message="Updating list of screens..." />
    </>
  )
}

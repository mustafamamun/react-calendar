import React, { useContext } from 'react'
import { Grid, GridRow, GridColumn, Button } from 'semantic-ui-react'
import { flow } from 'lodash'

import { CalContext } from '../../context/Context'
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  subMonths,
  subWeeks,
  subDays,
  addMonths,
  addWeeks,
  addDays,
  getMonth,
  getYear,
  getDate,
  getDay,
  format
} from 'date-fns'
import { months, daysFullInWeek } from '../utils'

const Nav = ({ onNavigation, onViewChange }) => {
  const { viewWindow, view, setViewWindow, setView } = useContext(CalContext)
  const addOneWeek = date => addWeeks(date, 1)
  const addOneMonth = date => addMonths(date, 1)
  const addOneDay = date => addDays(date, 1)
  const subOneWeek = date => subWeeks(date, 1)
  const subOneMonth = date => subMonths(date, 1)
  const subOneDay = date => subDays(date, 1)

  const setWeekView = () => {
    const window = {
      start: startOfWeek(viewWindow.start),
      end: endOfWeek(viewWindow.start)
    }
    setView('week')
    setViewWindow(window)
    onViewChange(window)
  }
  const setMonthView = () => {
    if (view !== 'month') {
      const window = {
        start: flow(startOfMonth, startOfWeek)(viewWindow.start),
        end: flow(endOfMonth, endOfWeek)(viewWindow.start)
      }
      setView('month')
      setViewWindow(window)
      onViewChange(window)
    }
  }
  const setDayView = () => {
    const window = {
      start: startOfDay(viewWindow.start),
      end: endOfDay(viewWindow.start)
    }
    setView('day')
    setViewWindow(window)
    onViewChange(window)
  }
  const setAgendaView = () => {
    setView(`agenda:${view}`)
  }

  const setToday = () => {
    if (
      view === 'month' ||
      (view.split(':')[0] === 'agenda' && view === 'month')
    ) {
      const window = {
        start: flow(startOfMonth, startOfWeek)(new Date()),
        end: flow(endOfMonth, endOfWeek)(new Date())
      }
      setViewWindow(window)
      onNavigation(window)
    }
    if (
      view === 'week' ||
      (view.split(':')[0] === 'agenda' && view === 'week')
    ) {
      const window = {
        start: startOfWeek(new Date()),
        end: endOfWeek(new Date())
      }
      setViewWindow(window)
      onNavigation(window)
    }
    if (view === 'day' || (view.split(':')[0] === 'agenda' && view === 'day')) {
      const window = {
        start: startOfDay(new Date()),
        end: endOfDay(new Date())
      }
      setViewWindow(window)
      onNavigation(window)
    }
  }

  const onBack = () => {
    if (
      view === 'month' ||
      (view.split(':')[0] === 'agenda' && view.split(':')[1] === 'month')
    ) {
      const window = {
        start: flow(
          addOneWeek,
          subOneMonth,
          startOfMonth,
          startOfWeek
        )(viewWindow.start),
        end: flow(
          addOneWeek,
          subOneMonth,
          endOfMonth,
          endOfWeek
        )(viewWindow.start)
      }
      setViewWindow(window)
      onNavigation(window)
    }
    if (
      view === 'week' ||
      (view.split(':')[0] === 'agenda' && view.split(':')[1] === 'week')
    ) {
      const window = {
        start: flow(subOneWeek, startOfWeek)(viewWindow.start),
        end: flow(subOneWeek, endOfWeek)(viewWindow.start)
      }
      setViewWindow(window)
      onNavigation(window)
    }
    if (
      view === 'day' ||
      (view.split(':')[0] === 'agenda' && view.split(':')[1] === 'day')
    ) {
      const window = {
        start: flow(subOneDay, startOfDay)(viewWindow.start),
        end: flow(subOneDay, endOfDay)(viewWindow.start)
      }
      setViewWindow(window)
      onNavigation(window)
    }
  }

  const onNext = () => {
    if (
      view === 'month' ||
      (view.split(':')[0] === 'agenda' && view.split(':')[1] === 'month')
    ) {
      const window = {
        start: flow(
          addOneWeek,
          addOneMonth,
          startOfMonth,
          startOfWeek
        )(viewWindow.start),
        end: flow(
          addOneWeek,
          addOneMonth,
          endOfMonth,
          endOfWeek
        )(viewWindow.start)
      }
      setViewWindow(window)
      onNavigation(window)
    }
    if (
      view === 'week' ||
      (view.split(':')[0] === 'agenda' && view.split(':')[1] === 'week')
    ) {
      const window = {
        start: flow(addOneWeek, startOfWeek)(viewWindow.start),
        end: flow(addOneWeek, endOfWeek)(viewWindow.start)
      }
      setViewWindow(window)
      onNavigation(window)
    }
    if (
      view === 'day' ||
      (view.split(':')[0] === 'agenda' && view.split(':')[1] === 'day')
    ) {
      const window = {
        start: flow(addOneDay, startOfDay)(viewWindow.start),
        end: flow(addOneDay, endOfDay)(viewWindow.start)
      }
      setViewWindow(window)
      onNavigation(window)
    }
  }

  return (
    <Grid stackable>
      <GridRow>
        <GridColumn
          width={1}
          as={Button}
          className='pr-0 pl-0 m-0'
          onClick={setToday}
        >
          Today
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className='pr-0 pl-0 m-0'
          onClick={onBack}
        >
          Back
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className='pr-0 pl-0 m-0'
          onClick={onNext}
        >
          Next
        </GridColumn>
        <GridColumn
          width={9}
          as={'div'}
          className={'nav-text-center pr-0 pl-0 m-0'}
        >
          {view === 'month' && (
            <b>
              {months[getMonth(addOneWeek(viewWindow.start))]}{' '}
              {getYear(addOneWeek(viewWindow.start))}
            </b>
          )}
          {view.split(':')[0] === 'agenda' && view.split(':')[1] === 'month' && (
            <span>
              {format(viewWindow.start, 'dd/MM/yyyy')} -{' '}
              {format(viewWindow.end, 'dd/MM/yyyy')}
            </span>
          )}
          {(view === 'week' ||
            (view.split(':')[0] === 'agenda' &&
              view.split(':')[1] === 'week')) && (
            <b>
              {months[getMonth(viewWindow.start)]}{' '}
              {getDate(viewWindow.start) < 10
                ? `0${getDate(viewWindow.start)}`
                : getDate(viewWindow.start)}{' '}
              -{' '}
              {getMonth(viewWindow.start) !== getMonth(viewWindow.end) && (
                <span>{months[getMonth(viewWindow.end)]} </span>
              )}
              {getDate(viewWindow.end) < 10
                ? `0${getDate(viewWindow.end)}`
                : getDate(viewWindow.end)}
            </b>
          )}
          {(view === 'day' ||
            (view.split(':')[0] === 'agenda' &&
              view.split(':')[1] === 'day')) && (
            <b>
              {daysFullInWeek[getDay(viewWindow.start)]}{' '}
              {months[getMonth(viewWindow.start)]}{' '}
              {getDate(viewWindow.start) < 10
                ? `0${getDate(viewWindow.start)}`
                : getDate(viewWindow.start)}
            </b>
          )}
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className='pr-0 pl-0 m-0'
          onClick={setMonthView}
        >
          Month
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className='pr-0 pl-0 m-0'
          onClick={setWeekView}
        >
          Week
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className='pr-0 pl-0 m-0'
          onClick={setDayView}
        >
          Day
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className='pr-0 pl-0 m-0'
          onClick={setAgendaView}
        >
          Agenda
        </GridColumn>
      </GridRow>
    </Grid>
  )
}

export default Nav

import React, { createContext, useState } from 'react'
import {
  endOfMonth,
  startOfMonth,
  endOfWeek,
  startOfWeek,
  startOfDay,
  endOfDay
} from 'date-fns'
import { flow } from 'lodash/fp'

export const CalContext = createContext({})
export const Context = ({ defaultView = 'month', ...rest }) => {
  const [view, setView] = useState(
    defaultView === 'agenda' ? 'agenda:month' : defaultView
  )
  const [viewWindow, setViewWindow] = useState({
    start:
      view === 'month' || 'agenda'
        ? flow(startOfMonth, startOfWeek)(new Date())
        : view === 'week'
        ? startOfWeek(new Date())
        : startOfDay(new Date()),
    end:
      view === 'month' || 'agenda'
        ? flow(endOfMonth, endOfWeek)(new Date())
        : view === 'week'
        ? endOfWeek(new Date())
        : endOfDay(new Date())
  })
  return (
    <CalContext.Provider
      value={{ view, setView, viewWindow, setViewWindow }}
      {...rest}
    />
  )
}

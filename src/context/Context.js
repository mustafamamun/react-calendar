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
      defaultView === 'day'
        ? startOfDay(new Date())
        : view === 'week'
        ? startOfWeek(new Date())
        : flow(startOfMonth, startOfWeek)(new Date()),
    end:
      defaultView === 'day'
        ? endOfDay(new Date())
        : view === 'week'
        ? endOfWeek(new Date())
        : flow(endOfMonth, endOfWeek)(new Date())
  })

  return (
    <CalContext.Provider
      value={{ view, setView, viewWindow, setViewWindow }}
      {...rest}
    />
  )
}

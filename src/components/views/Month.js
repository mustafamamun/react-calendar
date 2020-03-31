import React, { useContext, useState, useEffect } from 'react'
import {
  eachDayOfInterval,
  isBefore,
  startOfDay,
  isSameMinute,
  isAfter,
  isSameDay,
  isWithinInterval,
  endOfDay,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  isValid
} from 'date-fns'
import { Grid, GridColumn, GridRow } from 'semantic-ui-react'
import { getDate } from 'date-fns/esm'
import { isEmpty, sortBy, slice, flow, get, omit } from 'lodash'

import WeekRow from '../week-row/WeekRow'
import { CalContext } from '../../context/Context'
import { getEventsOfTheDay } from '../utils'

const Month = ({ currentTime, events, onSelect, onClickedEvent }) => {
  const { viewWindow, setViewWindow, setView } = useContext(CalContext)
  const [dayWidth, setDayWidth] = useState(0)
  const eachDay = eachDayOfInterval({
    start: viewWindow.start,
    end: viewWindow.end
  })
  const [selectedWindow, setSelectedWindow] = useState({})
  const onMouseClick = e => {
    e.preventDefault()
    if (isEmpty(selectedWindow) && isValid(new Date(e.target.id))) {
      setSelectedWindow({
        start: new Date(e.target.id),
        end: endOfDay(new Date(e.target.id))
      })
    }
  }
  const onMouseUp = e => {
    if (!isEmpty(selectedWindow)) {
      onSelect(selectedWindow)
      setSelectedWindow({})
    }
  }
  const onMouseOver = e => {
    if (
      !isEmpty(selectedWindow) &&
      isValid(new Date(e.target.id)) &&
      !isBefore(new Date(e.target.id), selectedWindow.start)
    ) {
      setSelectedWindow({
        ...selectedWindow,
        end: endOfDay(new Date(e.target.id))
      })
    }
    if (
      !isEmpty(selectedWindow) &&
      isValid(new Date(e.target.id)) &&
      isBefore(new Date(e.target.id), selectedWindow.start)
    ) {
      setSelectedWindow({
        ...selectedWindow,
        end: endOfDay(selectedWindow.start)
      })
    }
  }

  useEffect(() => {
    setDayWidth(
      get(
        document.getElementById(startOfDay(viewWindow.start)),
        'offsetWidth',
        0
      )
    )
    window.addEventListener('resize', resizeListener)
    return () => {
      window.removeEventListener('resize', resizeListener, false)
    }
  })

  const resizeListener = () => {
    setDayWidth(
      get(
        document.getElementById(startOfDay(viewWindow.start)),
        'offsetWidth',
        0
      )
    )
  }

  const ifSlotSelected = slotStart => {
    return (
      !isEmpty(selectedWindow) &&
      (isSameMinute(slotStart, selectedWindow.start) ||
        (isAfter(slotStart, selectedWindow.start) &&
          isBefore(slotStart, selectedWindow.end)))
    )
  }
  const sortedEvents = sortBy(events, 'start')
  const isEventStartOnDay = (e, day) => {
    return (
      isSameMinute(startOfDay(day), e.start) ||
      isWithinInterval(e.start, {
        start: startOfDay(day),
        end: endOfDay(day)
      })
    )
  }
  const isEventEndOnDay = (e, day) => {
    return (
      isSameMinute(endOfDay(day), e.end) ||
      isWithinInterval(e.end, {
        start: startOfDay(day),
        end: endOfDay(day)
      })
    )
  }
  const onMoreClicked = day => {
    setViewWindow({ start: startOfDay(day), end: endOfDay(day) })
    setView('day')
  }
  const eventWidth = (day, e) => {
    return (
      dayWidth *
        (isBefore(endOfWeek(day), e.end)
          ? getDate(endOfWeek(day)) - getDate(day) + 1
          : getDate(e.end) - getDate(day) + 1) -
      10
    )
  }
  const onEventClicked = e => {
    onClickedEvent(e)
  }

  return (
    <Grid columns={7}>
      <WeekRow />
      <GridRow className={'pt-0'}>
        {eachDay.map(day => {
          const date = getDate(day)
          const eventsOfTheDay = getEventsOfTheDay(day, sortedEvents)
          const firstTwoEvents = slice(eventsOfTheDay, 0, 2)
          return (
            <GridColumn
              as={'div'}
              key={day.toString()}
              id={day.toString()}
              className={`p-0 month-day ${
                isBefore(day, startOfDay(currentTime)) ? 'disable' : ''
              }
              ${
                ifSlotSelected(startOfDay(day))
                  ? 'selected'
                  : isSameDay(day, new Date())
                  ? 'same-day-month'
                  : ''
              }
              `}
              onMouseDown={onMouseClick}
              onMouseOver={onMouseOver}
              onMouseUp={onMouseUp}
            >
              <b>{date < 10 ? `0${date}` : date}</b>
              {firstTwoEvents.map(e => {
                return (
                  <div
                    onMouseDown={event => {
                      event.stopPropagation()
                      onEventClicked(omit(e, 'calprops'))
                    }}
                    className={`evt-base ${
                      isEventStartOnDay(e, day) ? 'event-start' : ''
                    } ${isEventEndOnDay(e, day) ? 'event-end' : ''}`}
                    key={e.title}
                  >
                    {(isEventStartOnDay(e, day) ||
                      (isSameDay(day, flow(startOfMonth, startOfWeek)(day)) &&
                        isBefore(
                          e.start,
                          flow(startOfMonth, startOfWeek)(day)
                        )) ||
                      (isSameDay(day, startOfWeek(day)) &&
                        isBefore(e.start, startOfWeek(day)))) && (
                      <div
                        className={'event-title-month'}
                        style={{
                          width: `${eventWidth(day, e)}px`
                        }}
                      >
                        {e.title}
                      </div>
                    )}
                  </div>
                )
              })}
              {eventsOfTheDay.length > 2 && (
                <div
                  className={'more-events-link'}
                  onMouseDown={event => {
                    event.stopPropagation()
                    onMoreClicked(day)
                  }}
                >
                  + {eventsOfTheDay.length - 2} more events
                </div>
              )}
            </GridColumn>
          )
        })}
      </GridRow>
    </Grid>
  )
}

export default Month

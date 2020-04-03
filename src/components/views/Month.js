import React, { useContext, useState, useEffect } from 'react'
import {
  eachDayOfInterval,
  isBefore,
  startOfDay,
  isSameMinute,
  isAfter,
  isSameDay,
  endOfDay,
  isValid,
  format
} from 'date-fns'
import { Grid, GridColumn, GridRow, Popup } from 'semantic-ui-react'
import { getDate } from 'date-fns/esm'
import { isEmpty, sortBy, slice, get, omit } from 'lodash'

import WeekRow from '../week-row/WeekRow'
import { CalContext } from '../../context/Context'
import {
  getEventsOfTheDay,
  isDayDisabled,
  getEventWidth,
  showEvent,
  isEventStartOnDay,
  isEventEndOnDay,
  ifDayIsInDisabledArray
} from '../utils'

const Month = ({
  currentTime,
  events,
  onSelect,
  onClickedEvent,
  disabledDays = []
}) => {
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

  const onMoreClicked = day => {
    setViewWindow({ start: startOfDay(day), end: endOfDay(day) })
    setView('day')
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
                isDayDisabled(day, disabledDays, currentTime) ? 'disable' : ''
              }
              ${
                ifSlotSelected(startOfDay(day)) &&
                !isDayDisabled(day, disabledDays, currentTime)
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
              {!ifDayIsInDisabledArray(disabledDays, day) && (
                <div>
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
                        {showEvent(e, day, disabledDays) && (
                          <Popup
                            disabled={!isEmpty(selectedWindow)}
                            className='popup-box'
                            content={e.title}
                            key={`${
                              e.title
                            }-${e.start.toString()}-${e.end.toString()}`}
                            header={`${format(
                              e.start,
                              'dd/MM/yy HH:mm'
                            )} - ${format(e.end, 'dd/MM/yy HH:mm')}`}
                            trigger={
                              <div
                                className={'event-title-month'}
                                style={{
                                  width: `${getEventWidth(
                                    day,
                                    e,
                                    dayWidth,
                                    disabledDays
                                  )}px`
                                }}
                              >
                                {e.title}
                              </div>
                            }
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
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

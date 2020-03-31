import React, { useContext, useState } from 'react'
import {
  eachDayOfInterval,
  addMinutes,
  isBefore,
  isSameDay,
  startOfDay,
  endOfMinute,
  isValid
} from 'date-fns'
import { isEmpty, sortBy } from 'lodash'

import { CalContext } from '../../context/Context'
import WeekRowWithDate from '../week-row/WeekRowWithDate'
import { Grid, GridRow, GridColumn } from 'semantic-ui-react'
import {
  timeSlots,
  getEventsOfTheDay,
  getEventIndex,
  getHighestIndex
} from '../utils'
import TimeSlotsInDay from '../time-slots-in-day/TimeSlotsInDay'

const Week = ({ currentTime, events, onSelect, onClickedEvent }) => {
  const { viewWindow } = useContext(CalContext)
  const [selectedWindow, setSelectedWindow] = useState({})
  const onMouseClick = e => {
    e.preventDefault()
    if (isEmpty(selectedWindow) && isValid(new Date(e.target.id))) {
      setSelectedWindow({
        start: new Date(e.target.id),
        end: endOfMinute(addMinutes(new Date(e.target.id), 29))
      })
    }
  }
  const eachDayInWeek = eachDayOfInterval({
    start: viewWindow.start,
    end: viewWindow.end
  })
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
        end: endOfMinute(addMinutes(new Date(e.target.id), 29))
      })
    }
    if (
      !isEmpty(selectedWindow) &&
      isValid(new Date(e.target.id)) &&
      isBefore(new Date(e.target.id), selectedWindow.start)
    ) {
      setSelectedWindow({
        ...selectedWindow,
        end: endOfMinute(addMinutes(selectedWindow.start, 29))
      })
    }
  }
  const onClickEvent = e => {
    onClickedEvent(e)
  }
  return (
    <Grid columns={8}>
      <WeekRowWithDate allDates={eachDayInWeek} />
      <GridRow className={'scroll-box pt-0 pb-0'}>
        <GridColumn className={'pr-0 pl-0'}>
          {timeSlots.map(time => {
            return (
              <GridRow key={time} className={'time-slot'}>
                <b>{time}</b>
              </GridRow>
            )
          })}
        </GridColumn>
        {eachDayInWeek.map(day => {
          const eventsOfTheDay = getEventsOfTheDay(startOfDay(day), events)
          const eventWithIndex = getEventIndex(sortBy(eventsOfTheDay, 'start'))
          const highestIndex = getHighestIndex(eventWithIndex)
          return (
            <GridColumn
              key={day.toISOString()}
              className={`p-0 day-column ${
                isSameDay(day, new Date()) ? 'same-day-wk' : ''
              }`}
            >
              <TimeSlotsInDay
                day={day}
                currentTime={currentTime}
                selectedWindow={selectedWindow}
                onMouseClick={onMouseClick}
                onMouseOver={onMouseOver}
                onMouseUp={onMouseUp}
                events={eventWithIndex}
                onClickEvent={onClickEvent}
                highestIndex={highestIndex}
              />
            </GridColumn>
          )
        })}
      </GridRow>
    </Grid>
  )
}

export default Week

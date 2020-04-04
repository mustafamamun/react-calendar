import React, { useContext, useState } from 'react'
import { Grid, GridRow, GridColumn } from 'semantic-ui-react'
import { addMinutes, isBefore, isSameDay, endOfMinute, isValid } from 'date-fns'
import { isEmpty, sortBy, cloneDeep } from 'lodash'

import TimeSlotsInDay from '../time-slots-in-day/TimeSlotsInDay'
import { CalContext } from '../../context/Context'
import {
  timeSlots,
  getEventsOfTheDay,
  getEventIndex,
  getHighestIndex
} from '../utils'

const Day = ({
  currentTime,
  events,
  onSelect,
  onClickedEvent,
  disabledDays = [],
  disabledHours = []
}) => {
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
  const mutableEvents = cloneDeep(events)
  const eventsOfTheDay = sortBy(
    getEventsOfTheDay(viewWindow.start, mutableEvents),
    'start'
  )
  if (!isEmpty(eventsOfTheDay)) {
    getEventIndex(sortBy(eventsOfTheDay, 'start'), viewWindow.start)
  }
  const highestIndex = getHighestIndex(eventsOfTheDay)

  return (
    <Grid>
      <GridRow className={'p-0 m-0 day-heading pr-1'}>
        <GridColumn width={3} className={'times-heading pr-0 pl-0'}>
          <b>Times</b>
        </GridColumn>
        <GridColumn width={13} />
      </GridRow>
      <GridRow className={'day-container p-0 m-0'}>
        <GridColumn width={3} className={'pr-0 pl-0 day-time-slots'}>
          {timeSlots.map((time, i) => {
            return (
              <GridRow key={i} className={'time-slot'}>
                <b>{time}</b>
              </GridRow>
            )
          })}
        </GridColumn>
        <GridColumn
          width={13}
          className={`pr-0 pl-0 ${
            isSameDay(viewWindow.start, new Date()) ? 'same-day' : ''
          }`}
        >
          <TimeSlotsInDay
            day={viewWindow.start}
            currentTime={currentTime}
            selectedWindow={selectedWindow}
            onMouseClick={onMouseClick}
            onMouseOver={onMouseOver}
            onMouseUp={onMouseUp}
            events={eventsOfTheDay}
            onClickEvent={onClickEvent}
            highestIndex={highestIndex}
            disabledDays={disabledDays}
            disabledHours={disabledHours}
          />
        </GridColumn>
      </GridRow>
    </Grid>
  )
}

export default Day

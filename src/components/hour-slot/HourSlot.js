import React from 'react'
import { addHours, startOfMinute, addMinutes, subHours } from 'date-fns'
import HalfAnHourSlot from './HalfAnHourSlot'
import { isSlotDisabled } from '../utils'

const HourSlot = ({
  day,
  hour,
  onMouseClick,
  selectedWindow,
  currentTime,
  onMouseOver,
  onMouseUp,
  events,
  onClickEvent,
  highestIndex,
  disabledDays,
  disabledHours
}) => {
  const startTZO = day.getTimezoneOffset()
  const endDate = addHours(day, hour)
  const endTZO = endDate.getTimezoneOffset()
  const zoneOffsetBefore = subHours(endDate, 1).getTimezoneOffset()

  let firstSlotStartHour
  if (startTZO > endTZO && zoneOffsetBefore === endTZO) {
    firstSlotStartHour = startOfMinute(addHours(day, hour - 1))
  } else if (startTZO < endTZO) {
    firstSlotStartHour = startOfMinute(addHours(day, hour + 1))
  } else {
    firstSlotStartHour = startOfMinute(addHours(day, hour))
  }
  const secondSlotStartHour = startOfMinute(addMinutes(firstSlotStartHour, 30))

  if (startTZO > endTZO && zoneOffsetBefore !== endTZO) {
    return <div className={'dst-div'}>DST HOUR</div>
  }
  return (
    <div>
      <HalfAnHourSlot
        className={`first-half-an-hour ${
          isSlotDisabled(
            firstSlotStartHour,
            currentTime,
            disabledDays,
            disabledHours
          )
            ? 'disable'
            : ''
        }`}
        id={firstSlotStartHour.toString()}
        onMouseDown={onMouseClick}
        onMouseOver={onMouseOver}
        onMouseUp={onMouseUp}
        slotStart={firstSlotStartHour}
        selectedWindow={selectedWindow}
        currentTime={currentTime}
        onClickEvent={onClickEvent}
        events={events}
        highestIndex={highestIndex}
        disabledDays={disabledDays}
        disabledHours={disabledHours}
      />
      <HalfAnHourSlot
        className={`last-half-an-hour ${
          isSlotDisabled(
            secondSlotStartHour,
            currentTime,
            disabledDays,
            disabledHours
          )
            ? 'disable'
            : ''
        }`}
        id={secondSlotStartHour.toString()}
        onMouseDown={onMouseClick}
        onMouseOver={onMouseOver}
        onMouseUp={onMouseUp}
        slotStart={secondSlotStartHour}
        selectedWindow={selectedWindow}
        currentTime={currentTime}
        events={events}
        onClickEvent={onClickEvent}
        highestIndex={highestIndex}
        disabledDays={disabledDays}
        disabledHours={disabledHours}
      />
    </div>
  )
}

export default HourSlot

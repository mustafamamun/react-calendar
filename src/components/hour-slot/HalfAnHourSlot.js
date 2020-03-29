import React from 'react'
import {
  getMinutes,
  isSameMinute,
  format,
  isWithinInterval,
  addMinutes,
  isSameSecond,
  startOfDay,
  differenceInMinutes
} from 'date-fns'

import { getEventOfTheSlot, getEventTime, getHight } from '../utils'

const HalfAnHourSlot = ({
  currentTime,
  slotStart,
  selectedWindow,
  events,
  onClickEvent,
  highestIndex,
  ...rest
}) => {
  const currentTiemBarStyle = {
    position: 'absolute',
    color: '#ca3e47',
    backgroundColor: '#ca3e47',
    height: '1px',
    border: 0,
    margin: 0,
    padding: 0,
    width: '100%',
    top: `${Math.floor(((getMinutes(currentTime) % 30) / 30) * 24)}px`,
    zIndex: 100000000000000
  }
  const eventStyle = e => {
    return {
      width: `${100 / highestIndex}%`,
      position: 'absolute',
      left: `${(100 / highestIndex) * e.calprops.position}%`,
      padding: 0,
      marginTop: `${getMarginTop(e, slotStart)}px`,
      height: `${getHeight(e, slotStart)}px`
    }
  }
  const getMarginTop = (e, slotStart) => {
    return isEventStartOnSlot(e, slotStart) &&
      differenceInMinutes(e.end, e.start) / 15 > 1
      ? differenceInMinutes(e.start, slotStart) > 0
        ? Math.round((differenceInMinutes(e.start, slotStart) * 25) / 30)
        : -1
      : -1
  }
  const getHeight = (e, slotStart) => {
    if (
      isEventStartOnSlot(e, slotStart) &&
      differenceInMinutes(e.end, e.start) / 15
    ) {
      return 25 - getMarginTop(e, slotStart)
    } else {
      return isEventEndOnSlot(e, slotStart) &&
        differenceInMinutes(e.end, e.start) / 15 > 1
        ? differenceInMinutes(addMinutes(slotStart, 30), e.end) > 0
          ? 26 -
            Math.round(
              (differenceInMinutes(addMinutes(slotStart, 30), e.end) * 25) / 30
            )
          : 26
        : 26
    }
  }
  const eventsOfTheSlot = getEventOfTheSlot(slotStart, events)
  const isEventStartOnSlot = (e, slotStart) => {
    return (
      isSameSecond(slotStart, e.start) ||
      isWithinInterval(e.start, {
        start: slotStart,
        end: addMinutes(slotStart, 30)
      })
    )
  }
  const isEventEndOnSlot = (e, slotStart) => {
    return (
      isSameSecond(addMinutes(slotStart, 30), e.end) ||
      isWithinInterval(e.end, {
        start: slotStart,
        end: addMinutes(slotStart, 30)
      })
    )
  }

  return (
    <div {...rest}>
      {isSameMinute(slotStart, selectedWindow.start) && (
        <div className={'show-selection'}>
          <div>{format(selectedWindow.start, 'dd-MM-yy, HH:mm')} -</div>
          <div>{format(selectedWindow.end, 'dd-MM-yy, HH:mm')}</div>
        </div>
      )}
      {isWithinInterval(currentTime, {
        start: slotStart,
        end: addMinutes(slotStart, 30)
      }) ? (
        <hr style={currentTiemBarStyle} />
      ) : (
        ''
      )}
      {eventsOfTheSlot.map((e, i) => {
        return (
          <div
            key={`${e.start}${slotStart}${e.title}${i}`}
            style={eventStyle(e)}
            className={`evnet-basic-slot ${
              isEventStartOnSlot(e, slotStart) ? 'event-start-slot' : ''
            } ${isEventEndOnSlot(e, slotStart) ? 'event-end-slot' : ''}`}
            onMouseDown={event => {
              event.stopPropagation()
              onClickEvent(e)
            }}
          >
            {' '}
            {(isEventStartOnSlot(e, slotStart) ||
              isSameMinute(startOfDay(slotStart), slotStart)) && (
              <div
                id={'title-box'}
                className={'title-box-day-wk'}
                style={{
                  height: `${getHight(e.start, e.end)}px`
                }}
              >
                {getEventTime(e, slotStart)},{e.title}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default HalfAnHourSlot

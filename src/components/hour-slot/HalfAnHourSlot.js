import React from 'react'
import {
  getMinutes,
  isSameMinute,
  format,
  isWithinInterval,
  addMinutes,
  differenceInMinutes
} from 'date-fns'
import { omit, isEmpty } from 'lodash'

import {
  getEventOfTheSlot,
  getEventTime,
  getHightEventDetails,
  lastSlotOfTheDayAndOcupied,
  ifSlotSelected,
  ifSlotIsInDisabledTime,
  showEventData,
  isEventStartOnSlot,
  isEventEndOnSlot
} from '../utils'
import ReactTooltip from 'react-tooltip'

const HalfAnHourSlot = ({
  currentTime,
  slotStart,
  selectedWindow,
  events,
  onClickEvent,
  highestIndex,
  onMouseOver,
  id,
  disabledDays,
  disabledHours,
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
    zIndex: 10000
  }
  const eventStyle = e => {
    return {
      width: `${(100 - 10) / (highestIndex + 1)}%`,
      position: 'absolute',
      left: `${((100 - 10) / (highestIndex + 1)) * e.calprops.position}%`,
      padding: 0,
      marginTop: `${getMarginTop(e, slotStart)}px`,
      height: `${getHeight(e, slotStart)}px`,
      backgroundColor: e.calprops.bgColor,
      color: e.calprops.color
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
    if (lastSlotOfTheDayAndOcupied(slotStart, e)) {
      return 24
    }
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
  return (
    <div {...rest} onMouseOver={onMouseOver} id={id}>
      {ifSlotSelected(slotStart, selectedWindow) &&
        isSameMinute(selectedWindow.end, addMinutes(slotStart, 29)) &&
        !ifSlotIsInDisabledTime(disabledDays, disabledHours, slotStart) && (
          <div className={'show-selection'}>
            <div>{format(selectedWindow.start, 'dd-MM-yy, HH:mm')} -</div>
            <div>{format(selectedWindow.end, 'dd-MM-yy, HH:mm')}</div>
          </div>
        )}
      {ifSlotSelected(slotStart, selectedWindow) &&
        !isSameMinute(selectedWindow.end, addMinutes(slotStart, 29)) &&
        !ifSlotIsInDisabledTime(disabledDays, disabledHours, slotStart) && (
          <div className={'show-selection'}></div>
        )}
      {isWithinInterval(currentTime, {
        start: slotStart,
        end: addMinutes(slotStart, 30)
      }) ? (
        <hr style={currentTiemBarStyle} />
      ) : (
        ''
      )}

      {!ifSlotIsInDisabledTime(disabledDays, disabledHours, slotStart) && (
        <div>
          {eventsOfTheSlot.map((e, i) => {
            return (
              <div key={`${e.title}${i}`}>
                <ReactTooltip
                  id={`${e.title}${i}`}
                  disable={!isEmpty(selectedWindow)}
                >
                  <b>{`${format(e.start, 'dd/MM/yy HH:mm')} - ${format(
                    e.end,
                    'dd/MM/yy HH:mm'
                  )}`}</b>
                  <p>{e.title}</p>
                </ReactTooltip>
                <div
                  data-tip
                  data-for={`${e.title}${i}`}
                  onMouseOver={() => onMouseOver({ target: { id } })}
                  style={eventStyle(e)}
                  className={`evnet-basic-slot ${
                    isEventStartOnSlot(e, slotStart) ? 'event-start-slot' : ''
                  } ${isEventEndOnSlot(e, slotStart) ? 'event-end-slot' : ''}`}
                  onMouseDown={event => {
                    event.stopPropagation()
                    onClickEvent(omit(e, 'calprops'))
                  }}
                >
                  {' '}
                  {showEventData(e, slotStart, disabledHours) && (
                    <div
                      className={'title-box-day-wk'}
                      style={{
                        height: `${getHightEventDetails(
                          e.start,
                          e.end,
                          slotStart,
                          disabledHours
                        )}px`,
                        paddingLeft: '2%',
                        paddingTop: '1%'
                      }}
                    >
                      {getEventTime(e, slotStart, disabledHours)},{e.title}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default HalfAnHourSlot

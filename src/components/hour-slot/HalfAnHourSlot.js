import React from 'react';
import {
  getMinutes,
  isSameMinute,
  format,
  isWithinInterval,
  addMinutes,
  isSameSecond,
  startOfDay,
  differenceInMinutes
} from 'date-fns';
import Truncate from 'react-truncate';

import { getEventOfTheSlot, getEventTime } from '../utils';

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
  };
  const eventsOfTheSlot = getEventOfTheSlot(slotStart, events);
  const isEventStartOnSlot = (e, slotStart) => {
    return (
      isSameSecond(new Date(slotStart), new Date(e.start)) ||
      isWithinInterval(new Date(e.start), {
        start: slotStart,
        end: addMinutes(slotStart, 30)
      })
    );
  };
  const isEventEndOnSlot = (e, day) => {
    return (
      isSameSecond(addMinutes(slotStart, 30), new Date(e.end)) ||
      isWithinInterval(new Date(e.end), {
        start: slotStart,
        end: addMinutes(slotStart, 30)
      })
    );
  };
  return (
    <div {...rest}>
      {isSameMinute(slotStart, new Date(selectedWindow.start)) && (
        <div className={'show-selection'}>
          <div>
            {format(new Date(selectedWindow.start), 'dd-MM-yy, HH:mm')} -
          </div>
          <div>{format(new Date(selectedWindow.end), 'dd-MM-yy, HH:mm')}</div>
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
      {eventsOfTheSlot.map(e => {
        return (
          <div
            key={`${e.start}${slotStart}${e.title}`}
            style={{
              width: `${100 / highestIndex}%`,
              position: 'absolute',
              left: `${(100 / highestIndex) * e.calprops.position}%`,
              padding: 0,
              marginTop:
                isEventStartOnSlot(e, slotStart) &&
                differenceInMinutes(new Date(e.end), new Date(e.start)) / 30 > 1
                  ? `${
                      differenceInMinutes(new Date(e.start), slotStart) > 0
                        ? Math.round(
                            (differenceInMinutes(new Date(e.start), slotStart) *
                              25) /
                              30
                          )
                        : -1
                    }px`
                  : '-1px',
              height:
                isEventEndOnSlot(e, slotStart) &&
                differenceInMinutes(new Date(e.end), new Date(e.start)) / 30 > 1
                  ? `${
                      differenceInMinutes(
                        addMinutes(slotStart, 30),
                        new Date(e.end)
                      ) > 0
                        ? 26 -
                          Math.round(
                            (differenceInMinutes(
                              addMinutes(slotStart, 30),
                              new Date(e.end)
                            ) *
                              25) /
                              30
                          )
                        : 26
                    }px`
                  : '26px'
            }}
            className={`evnet-basic-slot ${
              isEventStartOnSlot(e, slotStart) ? 'event-start-slot' : ''
            } ${isEventEndOnSlot(e, slotStart) ? 'event-end-slot' : ''}`}
            onMouseDown={event => {
              event.stopPropagation();
              onClickEvent(e);
            }}
          >
            {' '}
            {(isEventStartOnSlot(e, slotStart) ||
              isSameMinute(startOfDay(slotStart), slotStart)) && (
              <div
                style={{
                  position: 'absolute',
                  zIndex: '10000',
                  wordBreak: 'break-all',
                  lineHeight: 'normal'
                }}
              >
                <Truncate
                  lines={Math.ceil(
                    differenceInMinutes(new Date(e.end), new Date(e.start)) / 30
                  )}
                >
                  {getEventTime(e, slotStart)}, {e.title}
                </Truncate>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HalfAnHourSlot;

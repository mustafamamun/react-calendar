import React from 'react';
import { isEmpty } from 'lodash';
import {
  addHours,
  startOfHour,
  startOfMinute,
  addMinutes,
  isWithinInterval,
  getMinutes,
  isAfter,
  isSameMinute,
  isBefore,
  getHours
} from 'date-fns';
import HalfAnHourSlot from './HalfAnHourSlot';

const HourSlot = ({
  day,
  hour,
  onMouseClick,
  selectedWindow,
  currentTime,
  onMouseOver,
  onMouseUp
}) => {
  const firstSlotStartHour = startOfHour(addHours(day, hour));
  const secondSlotStartHour = startOfMinute(addMinutes(firstSlotStartHour, 30));
  const currentTiemBarStyle = {
    position: 'absolute',
    color: 'red',
    backgroundColor: 'red',
    height: '1px',
    margin: 0,
    width: '100%',
    top: `${Math.floor(((getMinutes(currentTime) % 30) / 30) * 24)}px`
  };
  const ifSlotSelected = slotStart => {
    return (
      !isEmpty(selectedWindow) &&
      (isSameMinute(slotStart, new Date(selectedWindow.start)) ||
        (isAfter(slotStart, new Date(selectedWindow.start)) &&
          isBefore(slotStart, new Date(selectedWindow.end))))
    );
  };

  return (
    <>
      <HalfAnHourSlot
        className={`first-half-an-hour ${
          isAfter(currentTime, firstSlotStartHour) ? 'disable' : ''
        } ${ifSlotSelected(firstSlotStartHour) ? 'selected' : ''}`}
        id={firstSlotStartHour.toString()}
        onMouseDown={onMouseClick}
        onMouseOver={onMouseOver}
        onMouseUp={onMouseUp}
        slotStart={firstSlotStartHour}
        selectedWindow={selectedWindow}
        currentTime={currentTime}
      />
      <HalfAnHourSlot
        className={`last-half-an-hour ${
          isAfter(currentTime, secondSlotStartHour) ? 'disable' : ''
        } ${ifSlotSelected(secondSlotStartHour) ? 'selected' : ''}`}
        id={secondSlotStartHour.toString()}
        onMouseDown={onMouseClick}
        onMouseOver={onMouseOver}
        onMouseUp={onMouseUp}
        slotStart={secondSlotStartHour}
        selectedWindow={selectedWindow}
        currentTime={currentTime}
      />
    </>
  );
};

export default HourSlot;

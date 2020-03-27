import React from 'react';
import { isEmpty } from 'lodash';
import {
  addHours,
  startOfHour,
  startOfMinute,
  addMinutes,
  isAfter,
  isSameMinute,
  isBefore
} from 'date-fns';
import HalfAnHourSlot from './HalfAnHourSlot';

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
  highestIndex
}) => {
  const firstSlotStartHour = startOfHour(addHours(day, hour));
  const secondSlotStartHour = startOfMinute(addMinutes(firstSlotStartHour, 30));

  const ifSlotSelected = slotStart => {
    return (
      !isEmpty(selectedWindow) &&
      (isSameMinute(slotStart, selectedWindow.start) ||
        (isAfter(slotStart, selectedWindow.start) &&
          isBefore(slotStart, selectedWindow.end)))
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
        onClickEvent={onClickEvent}
        events={events}
        highestIndex={highestIndex}
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
        events={events}
        onClickEvent={onClickEvent}
        highestIndex={highestIndex}
      />
    </>
  );
};

export default HourSlot;

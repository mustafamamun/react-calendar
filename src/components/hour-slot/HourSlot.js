import React from 'react';
import {
  addHours,
  startOfHour,
  startOfMinute,
  addMinutes,
  isBefore
} from 'date-fns';

const HourSlot = ({ day, hour, onMouseClick, onMouseDrag }) => {
  const firstSlotStartHour = startOfHour(addHours(day, hour));
  const secondSlotStartHour = startOfMinute(addMinutes(firstSlotStartHour, 30));

  return (
    <>
      <div
        className={`first-half-an-hour ${
          isBefore(new Date(), firstSlotStartHour) ? '' : 'disable'
        }`}
        id={firstSlotStartHour.toISOString()}
        onMouseDown={onMouseClick}
      />
      <div
        className={`last-half-an-hour ${
          isBefore(new Date(), firstSlotStartHour) ? '' : 'disable'
        }`}
        id={secondSlotStartHour.toString()}
        onMouseDown={onMouseClick}
      />
    </>
  );
};

export default HourSlot;

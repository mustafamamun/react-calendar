import React from 'react';
import {
  getMinutes,
  isSameMinute,
  format,
  isWithinInterval,
  addMinutes
} from 'date-fns';

const HalfAnHourSlot = ({
  currentTime,
  slotStart,
  selectedWindow,
  ...rest
}) => {
  const currentTiemBarStyle = {
    position: 'absolute',
    color: 'red',
    backgroundColor: 'red',
    height: '1px',
    margin: 0,
    width: '100%',
    top: `${Math.floor(((getMinutes(currentTime) % 30) / 30) * 24)}px`
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
    </div>
  );
};

export default HalfAnHourSlot;

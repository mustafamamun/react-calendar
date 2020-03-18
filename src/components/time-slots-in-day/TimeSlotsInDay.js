import React from 'react';
import { GridRow } from 'semantic-ui-react';
import { range } from 'lodash';
import HourSlot from '../hour-slot/HourSlot';

const TimeSlotsInDay = ({ day, ...rest }) => {
  return (
    <>
      {range(24).map((hour, index) => {
        return (
          <GridRow key={`${day}${index}`} className="hour">
            <HourSlot day={day} hour={hour} {...rest} />
          </GridRow>
        );
      })}
    </>
  );
};

export default TimeSlotsInDay;

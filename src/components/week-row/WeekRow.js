import React from 'react';
import { GridRow, GridColumn } from 'semantic-ui-react';
import { daysInWeek } from '../utils';

const WeekRow = () => {
  return (
    <GridRow className={'p-0 m-0 month-heading'}>
      {daysInWeek.map(day => {
        return (
          <GridColumn key={day} className={'day-in-week'}>
            {day}
          </GridColumn>
        );
      })}
    </GridRow>
  );
};

export default WeekRow;

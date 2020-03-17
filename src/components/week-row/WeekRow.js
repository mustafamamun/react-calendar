import React from 'react';
import { GridRow, GridColumn } from 'semantic-ui-react';
import { daysInWeek } from '../utils';

const WeekRow = () => {
  return (
    <GridRow className={'pb-0'}>
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

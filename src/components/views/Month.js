import React, { useContext } from 'react';
import { eachDayOfInterval, isBefore, startOfDay } from 'date-fns';
import { Grid, GridColumn, GridRow } from 'semantic-ui-react';

import { CalContext } from '../../context/Context';
import { getDate } from 'date-fns/esm';
import WeekRow from '../week-row/WeekRow';

const Month = ({ currentTime }) => {
  const { viewWindow } = useContext(CalContext);
  const eachDay = eachDayOfInterval({
    start: viewWindow.start,
    end: viewWindow.end
  });
  return (
    <Grid columns={7}>
      <WeekRow />
      <GridRow className={'pt-0'}>
        {eachDay.map(day => {
          const date = getDate(day);
          return (
            <GridColumn
              key={day.toISOString()}
              className={`month-day ${
                isBefore(day, startOfDay(currentTime)) ? 'disable' : ''
              }`}
            >
              {date}
            </GridColumn>
          );
        })}
      </GridRow>
    </Grid>
  );
};

export default Month;

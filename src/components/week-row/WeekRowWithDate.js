import React from 'react';
import { GridRow, GridColumn } from 'semantic-ui-react';
import { daysInWeek } from '../utils';
import { getDate } from 'date-fns';

const WeekRowWithDate = ({ allDates }) => {
  return (
    <GridRow className={'pb-0 pr-1 wk-day-name-row'}>
      <GridColumn className={'day-in-week'}>
        <b>Times</b>
      </GridColumn>
      {daysInWeek.map((day, i) => {
        return (
          <GridColumn key={day} className={'day-in-week'}>
            <b>
              {getDate(allDates[i]) < 10
                ? `0${getDate(allDates[i])}`
                : getDate(allDates[i])}{' '}
              {day}
            </b>
          </GridColumn>
        );
      })}
    </GridRow>
  );
};

export default WeekRowWithDate;

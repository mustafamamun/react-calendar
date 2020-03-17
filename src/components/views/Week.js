import React, { useContext } from 'react';
import { eachDayOfInterval } from 'date-fns';

import { CalContext } from '../../context/Context';
import WeekRowWithDate from '../week-row/WeekRowWithDate';
import { Grid, GridRow, GridColumn } from 'semantic-ui-react';
import { timeSlots } from '../utils';
import TimeSlotsInDay from '../time-slots-in-day/TimeSlotsInDay';

const Week = () => {
  const { viewWindow } = useContext(CalContext);

  const eachDayInWeek = eachDayOfInterval({
    start: viewWindow.start,
    end: viewWindow.end
  });

  return (
    <Grid columns={8}>
      <WeekRowWithDate allDates={eachDayInWeek} />
      <GridRow className={'wk-container pt-0 pb-0'}>
        <GridColumn className={'pr-0 pl-0'}>
          {timeSlots.map(time => {
            return (
              <GridRow key={time} className={'time-slot'}>
                <b>{time}</b>
              </GridRow>
            );
          })}
        </GridColumn>
        {eachDayInWeek.map(day => {
          return (
            <GridColumn key={day.toISOString()} className="p-0 day-column">
              <TimeSlotsInDay day={day} />
            </GridColumn>
          );
        })}
      </GridRow>
    </Grid>
  );
};

export default Week;

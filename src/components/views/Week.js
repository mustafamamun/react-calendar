import React, { useContext, useState } from 'react';
import { eachDayOfInterval, addMinutes, isBefore } from 'date-fns';
import { isEmpty } from 'lodash';

import { CalContext } from '../../context/Context';
import WeekRowWithDate from '../week-row/WeekRowWithDate';
import { Grid, GridRow, GridColumn } from 'semantic-ui-react';
import { timeSlots } from '../utils';
import TimeSlotsInDay from '../time-slots-in-day/TimeSlotsInDay';

const Week = ({ currentTime }) => {
  const { viewWindow } = useContext(CalContext);
  const [selectedWindow, setSelectedWindow] = useState({});
  const onMouseClick = e => {
    e.preventDefault();
    setSelectedWindow({
      start: e.target.id,
      end: addMinutes(new Date(e.target.id), '30').toString()
    });
  };
  const eachDayInWeek = eachDayOfInterval({
    start: viewWindow.start,
    end: viewWindow.end
  });
  const onMouseUp = e => {
    console.log(selectedWindow);
    setSelectedWindow({});
  };
  const onMouseOver = e => {
    if (
      !isEmpty(selectedWindow) &&
      e.target.id &&
      !isBefore(new Date(e.target.id), new Date(selectedWindow.start))
    ) {
      setSelectedWindow({
        ...selectedWindow,
        end: addMinutes(new Date(e.target.id), 30).toString()
      });
    }
    if (isBefore(new Date(e.target.id), new Date(selectedWindow.start))) {
      setSelectedWindow({
        ...selectedWindow,
        end: addMinutes(new Date(selectedWindow.start), 30).toString()
      });
    }
  };

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
              <TimeSlotsInDay
                day={day}
                currentTime={currentTime}
                selectedWindow={selectedWindow}
                onMouseClick={onMouseClick}
                onMouseOver={onMouseOver}
                onMouseUp={onMouseUp}
              />
            </GridColumn>
          );
        })}
      </GridRow>
    </Grid>
  );
};

export default Week;

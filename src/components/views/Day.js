import React, { useContext, useState } from 'react';
import { Grid, GridRow, GridColumn } from 'semantic-ui-react';

import TimeSlotsInDay from '../time-slots-in-day/TimeSlotsInDay';
import { CalContext } from '../../context/Context';

import { timeSlots, getEventsOfTheDay } from '../utils';
import { addMinutes, isBefore, isSameDay } from 'date-fns';
import { isEmpty, sortBy } from 'lodash';

const Day = ({ currentTime, events }) => {
  const { viewWindow } = useContext(CalContext);
  const [selectedWindow, setSelectedWindow] = useState({});
  const onMouseClick = e => {
    e.preventDefault();
    setSelectedWindow({
      start: e.target.id,
      end: addMinutes(new Date(e.target.id), '30').toString()
    });
  };
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
  const sortedEvents = sortBy(events, 'start');
  const eventsOfTheDay = getEventsOfTheDay(
    new Date(viewWindow.start),
    sortedEvents
  );

  return (
    <Grid>
      <GridRow className={'p-0 m-0 day-heading pr-1'}>
        <GridColumn width={3} className={'times-heading pr-0 pl-0'}>
          <b>Times</b>
        </GridColumn>
        <GridColumn width={13} />
      </GridRow>
      <GridRow className={'day-container p-0 m-0'}>
        <GridColumn width={3} className={'pr-0 pl-0 day-time-slots'}>
          {timeSlots.map((time, i) => {
            return (
              <GridRow key={i} className={'time-slot'}>
                <b>{time}</b>
              </GridRow>
            );
          })}
        </GridColumn>
        <GridColumn
          width={13}
          className={`pr-0 pl-0 ${
            isSameDay(new Date(viewWindow.start), new Date()) ? 'same-day' : ''
          }`}
        >
          <TimeSlotsInDay
            day={new Date(viewWindow.start)}
            currentTime={currentTime}
            selectedWindow={selectedWindow}
            onMouseClick={onMouseClick}
            onMouseOver={onMouseOver}
            onMouseUp={onMouseUp}
            events={eventsOfTheDay}
          />
        </GridColumn>
      </GridRow>
    </Grid>
  );
};

export default Day;

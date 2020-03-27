import React from 'react';
import { GridRow, GridColumn, Grid } from 'semantic-ui-react';
import { daysInWeek, addLeadingZero, months } from '../utils';
import {
  isSameDay,
  getDay,
  getDate,
  getHours,
  getMinutes,
  getMonth,
  eachDayOfInterval,
  isBefore,
  isAfter,
  endOfDay
} from 'date-fns';

const Agenda = ({ events }) => {
  return (
    <>
      <Grid>
        <GridRow className={'agenda-header-row'}>
          <GridColumn width={3} className={'agenda-column-header'}>
            Date
          </GridColumn>
          <GridColumn width={4} className={'agenda-column-header'}>
            Time
          </GridColumn>
          <GridColumn width={9} className={'agenda-column-header'}>
            Event
          </GridColumn>
        </GridRow>
      </Grid>
      <Grid as="div" className="scroll-box">
        {events.map((e, i) => {
          if (isSameDay(e.start, e.end)) {
            return (
              <GridRow className={'agenda-event-row'} key={`${e.start}${i}`}>
                <GridColumn width={3} className={'agenda-event-column '}>
                  {daysInWeek[getDay(e.start)]} {months[getMonth(e.start)]}{' '}
                  {getDate(e.start)}
                </GridColumn>
                <GridColumn width={4} className={'agenda-event-column '}>
                  {addLeadingZero(getHours(e.start))}:
                  {addLeadingZero(getMinutes(e.start))} &nbsp; - &nbsp;
                  {addLeadingZero(getHours(e.end))}:
                  {addLeadingZero(getMinutes(e.end))}
                </GridColumn>
                <GridColumn width={9} className={'agenda-event-column '}>
                  {e.title}
                </GridColumn>
              </GridRow>
            );
          } else {
            const days = eachDayOfInterval({ start: e.start, end: e.end });
            return days.map((day, i) => {
              return (
                <GridRow
                  className={'agenda-event-row'}
                  key={`${day.toString()}${i}`}
                >
                  <GridColumn width={3} className={'agenda-event-column '}>
                    {daysInWeek[getDay(day)]} {months[getMonth(day)]}{' '}
                    {getDate(day)}
                  </GridColumn>
                  <GridColumn width={4} className={'agenda-event-column '}>
                    {isSameDay(e.start, day) && (
                      <span>
                        {addLeadingZero(getHours(e.start))}:
                        {addLeadingZero(getMinutes(e.start))} &nbsp; >>
                      </span>
                    )}
                    {isSameDay(e.end, day) && (
                      <span>
                        {'<<'} &nbsp;
                        {addLeadingZero(getHours(e.start))}:
                        {addLeadingZero(getMinutes(e.start))}
                      </span>
                    )}
                    {isBefore(e.start, day) &&
                      isAfter(e.end, endOfDay(day)) && (
                        <span>{'<<'} &nbsp; all day &nbsp; >></span>
                      )}
                  </GridColumn>
                  <GridColumn width={9} className={'agenda-event-column '}>
                    {e.title}
                  </GridColumn>
                </GridRow>
              );
            });
          }
        })}
      </Grid>
    </>
  );
};

export default Agenda;

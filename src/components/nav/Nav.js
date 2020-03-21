import React, { useContext } from 'react';
import { Grid, GridRow, GridColumn, Button } from 'semantic-ui-react';
import { flow } from 'lodash/fp';

import { CalContext } from '../../context/Context';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  subMonths,
  subWeeks,
  subDays,
  addMonths,
  addWeeks,
  addDays,
  getMonth,
  getYear,
  getDate,
  getDay
} from 'date-fns';
import { months, daysFullInWeek } from '../utils';

const Nav = () => {
  const { viewWindow, view, setViewWindow, setView } = useContext(CalContext);
  const addOneWeek = date => addWeeks(date, 1);
  const addOneMonth = date => addMonths(date, 1);
  const addOneDay = date => addDays(date, 1);
  const subOneWeek = date => subWeeks(date, 1);
  const subOneMonth = date => subMonths(date, 1);
  const subOneDay = date => subDays(date, 1);

  const setWeekView = () => {
    setView('week');
    setViewWindow({
      start: startOfWeek(viewWindow.start),
      end: endOfWeek(viewWindow.start)
    });
  };
  const setMonthView = () => {
    if (view !== 'month') {
      setView('month');
      setViewWindow({
        start: flow(startOfMonth, startOfWeek)(viewWindow.start),
        end: flow(endOfMonth, endOfWeek)(viewWindow.start)
      });
    }
  };
  const setDayView = () => {
    setView('day');
    setViewWindow({
      start: startOfDay(viewWindow.start),
      end: endOfDay(viewWindow.start)
    });
  };
  const setAgendaView = () => {
    //TO DO: Might need to set as month view
    setView('agenda');
  };

  const setToday = () => {
    if (view === 'month' || view === 'agenda') {
      setViewWindow({
        start: flow(startOfMonth, startOfWeek)(new Date()),
        end: flow(endOfMonth, endOfWeek)(new Date())
      });
    }
    if (view === 'week') {
      setViewWindow({
        start: startOfWeek(new Date()),
        end: endOfWeek(new Date())
      });
    }
    if (view === 'day') {
      setViewWindow({
        start: startOfDay(new Date()),
        end: endOfDay(new Date())
      });
    }
  };

  const onBack = () => {
    if (view === 'month' || view === 'agenda') {
      setViewWindow({
        start: flow(
          addOneWeek,
          subOneMonth,
          startOfMonth,
          startOfWeek
        )(viewWindow.start),
        end: flow(
          addOneWeek,
          subOneMonth,
          endOfMonth,
          endOfWeek
        )(viewWindow.start)
      });
    }
    if (view === 'week') {
      setViewWindow({
        start: flow(subOneWeek, startOfWeek)(viewWindow.start),
        end: flow(subOneWeek, endOfWeek)(viewWindow.start)
      });
    }
    if (view === 'day') {
      setViewWindow({
        start: flow(subOneDay, startOfDay)(viewWindow.start),
        end: flow(subOneDay, endOfDay)(viewWindow.start)
      });
    }
  };

  const onNext = () => {
    if (view === 'month' || view === 'agenda') {
      setViewWindow({
        start: flow(
          addOneWeek,
          addOneMonth,
          startOfMonth,
          startOfWeek
        )(viewWindow.start),
        end: flow(
          addOneWeek,
          addOneMonth,
          endOfMonth,
          endOfWeek
        )(viewWindow.start)
      });
    }
    if (view === 'week') {
      setViewWindow({
        start: flow(addOneWeek, startOfWeek)(viewWindow.start),
        end: flow(addOneWeek, endOfWeek)(viewWindow.start)
      });
    }
    if (view === 'day') {
      setViewWindow({
        start: flow(addOneDay, startOfDay)(viewWindow.start),
        end: flow(addOneDay, endOfDay)(viewWindow.start)
      });
    }
  };

  return (
    <Grid stackable>
      <GridRow>
        <GridColumn
          width={1}
          as={Button}
          className="pr-0 pl-0 m-0"
          onClick={setToday}
        >
          Today
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className="pr-0 pl-0 m-0"
          onClick={onBack}
        >
          Back
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className="pr-0 pl-0 m-0"
          onClick={onNext}
        >
          Next
        </GridColumn>
        <GridColumn
          width={9}
          as={'div'}
          className={'nav-text-center pr-0 pl-0 m-0'}
        >
          {view === 'month' && (
            <b>
              {months[getMonth(addOneWeek(viewWindow.start))]}{' '}
              {getYear(addOneWeek(viewWindow.start))}
            </b>
          )}
          {view === 'week' && (
            <b>
              {months[getMonth(viewWindow.start)]}{' '}
              {getDate(viewWindow.start) < 10
                ? `0${getDate(viewWindow.start)}`
                : getDate(viewWindow.start)}{' '}
              -{' '}
              {getMonth(viewWindow.start) !== getMonth(viewWindow.end) && (
                <span>{months[getMonth(viewWindow.end)]} </span>
              )}
              {getDate(viewWindow.end) < 10
                ? `0${getDate(viewWindow.end)}`
                : getDate(viewWindow.end)}
            </b>
          )}
          {view === 'day' && (
            <b>
              {daysFullInWeek[getDay(viewWindow.start)]}{' '}
              {months[getMonth(viewWindow.start)]}{' '}
              {getDate(viewWindow.start) < 10
                ? `0${getDate(viewWindow.start)}`
                : getDate(viewWindow.start)}
            </b>
          )}
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className="pr-0 pl-0 m-0"
          onClick={setMonthView}
        >
          Month
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className="pr-0 pl-0 m-0"
          onClick={setWeekView}
        >
          Week
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className="pr-0 pl-0 m-0"
          onClick={setDayView}
        >
          Day
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className="pr-0 pl-0 m-0"
          onClick={setAgendaView}
        >
          Agenda
        </GridColumn>
      </GridRow>
    </Grid>
  );
};

export default Nav;

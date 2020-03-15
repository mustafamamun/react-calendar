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
  addDays
} from 'date-fns';

const Nav = () => {
  const { viewWindow, view, setViewWindow, setView } = useContext(CalContext);
  const setWeekView = () => {
    setView('week');
    setViewWindow({
      start: startOfWeek(viewWindow.start),
      end: endOfWeek(viewWindow.start)
    });
  };
  const setMonthView = () => {
    setView('month');
    setViewWindow({
      start: flow(startOfMonth, startOfWeek)(viewWindow.start),
      end: flow(endOfMonth, endOfWeek)(viewWindow.start)
    });
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
    if (view === 'Week') {
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
        start: flow(startOfMonth, startOfWeek)(subMonths(viewWindow.start, 1)),
        end: flow(endOfMonth, endOfWeek)(subMonths(viewWindow.start, 1))
      });
    }
    if (view === 'week') {
      setViewWindow({
        start: startOfWeek(subWeeks(viewWindow.start, 1)),
        end: endOfWeek(subWeeks(viewWindow.start, 1))
      });
    }
    if (view === 'day') {
      setViewWindow({
        start: startOfDay(subDays(viewWindow.start, 1)),
        end: endOfDay(subDays(viewWindow.start, 1))
      });
    }
  };

  const onNext = () => {
    if (view === 'month' || view === 'agenda') {
      setViewWindow({
        start: flow(startOfMonth, startOfWeek)(addMonths(viewWindow.start, 1)),
        end: flow(endOfMonth, endOfWeek)(addMonths(viewWindow.start, 1))
      });
    }
    if (view === 'week') {
      setViewWindow({
        start: startOfWeek(addWeeks(viewWindow.start, 1)),
        end: endOfWeek(addWeeks(viewWindow.start, 1))
      });
    }
    if (view === 'day') {
      setViewWindow({
        start: startOfDay(addDays(viewWindow.start, 1)),
        end: endOfDay(addDays(viewWindow.start, 1))
      });
    }
  };

  return (
    <Grid stackable>
      <GridRow>
        <GridColumn
          width={1}
          as={Button}
          className="pr-0 pl-0"
          onClick={setToday}
        >
          Today
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className="pr-0 pl-0"
          onClick={onBack}
        >
          Back
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className="pr-0 pl-0"
          onClick={onNext}
        >
          Next
        </GridColumn>
        <GridColumn
          width={8}
          as={'div'}
          className={'nav-text-center pr-0 pl-0'}
        >
          Tuesday Mar 24
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className="pr-0 pl-0"
          onClick={setMonthView}
        >
          Month
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className="pr-0 pl-0"
          onClick={setWeekView}
        >
          Week
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className="pr-0 pl-0"
          onClick={setDayView}
        >
          Day
        </GridColumn>
        <GridColumn
          width={1}
          as={Button}
          className="pr-0 pl-0"
          onClick={setAgendaView}
        >
          Agenda
        </GridColumn>
      </GridRow>
    </Grid>
  );
};

export default Nav;

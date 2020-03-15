import React, { useContext } from 'react';
import { CalContext } from '../../context/Context';
import Month from './Month';
import Week from './Week';
import Day from './Day';
import Agenda from './Agenda';
const IndexView = () => {
  const { view } = useContext(CalContext);
  if (view === 'month') {
    return <Month />;
  }
  if (view === 'week') {
    return <Week />;
  }
  if (view === 'day') {
    return <Day />;
  }
  if (view === 'agenda') {
    return <Agenda />;
  }
};

export default IndexView;

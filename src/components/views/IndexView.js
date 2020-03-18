import React, { useContext } from 'react';
import { CalContext } from '../../context/Context';
import Month from './Month';
import Week from './Week';
import Day from './Day';
import Agenda from './Agenda';
const IndexView = ({ ...props }) => {
  const { view } = useContext(CalContext);
  if (view === 'month') {
    return <Month {...props} />;
  }
  if (view === 'week') {
    return <Week {...props} />;
  }
  if (view === 'day') {
    return <Day {...props} />;
  }
  if (view === 'agenda') {
    return <Agenda {...props} />;
  }
};

export default IndexView;

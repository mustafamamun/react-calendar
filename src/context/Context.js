import React, { createContext, useState } from 'react';
import { endOfMonth, startOfMonth, endOfWeek, startOfWeek } from 'date-fns';
import { flow } from 'lodash/fp';

export const CalContext = createContext({});
export const Context = props => {
  const [view, setView] = useState('month');
  const [viewWindow, setViewWindow] = useState({
    start: flow(startOfMonth, startOfWeek)(new Date()),
    end: flow(endOfMonth, endOfWeek)(new Date())
  });
  return (
    <CalContext.Provider
      value={{ view, setView, viewWindow, setViewWindow }}
      {...props}
    />
  );
};

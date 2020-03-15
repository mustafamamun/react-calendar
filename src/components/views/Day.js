import React, { useContext } from 'react';
import { eachDayOfInterval } from 'date-fns';

import { CalContext } from '../../context/Context';

const Day = () => {
  const { viewWindow } = useContext(CalContext);
  console.log(
    eachDayOfInterval({ start: viewWindow.start, end: viewWindow.end })
  );
  return <div>Day</div>;
};

export default Day;

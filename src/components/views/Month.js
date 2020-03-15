import React, { useContext } from 'react';
import { eachDayOfInterval } from 'date-fns';

import { CalContext } from '../../context/Context';

const Month = () => {
  const { viewWindow } = useContext(CalContext);
  console.log(
    eachDayOfInterval({ start: viewWindow.start, end: viewWindow.end })
  );
  return <div>Month</div>;
};

export default Month;

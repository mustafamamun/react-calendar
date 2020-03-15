import React, { useContext } from 'react';
import { eachDayOfInterval } from 'date-fns';

import { CalContext } from '../../context/Context';

const Agenda = () => {
  const { viewWindow } = useContext(CalContext);
  console.log(
    eachDayOfInterval({ start: viewWindow.start, end: viewWindow.end })
  );
  return <div>Agenda</div>;
};

export default Agenda;

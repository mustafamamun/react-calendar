import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Context } from './context/Context';
import Nav from './components/nav/Nav';
import Views from './components/views/IndexView';
import { useInterval } from 'react-use';

function Calendar({ events = [] }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  useInterval(() => {
    setCurrentTime(new Date());
  }, 5 * 60 * 1000);
  const mockevents = [
    {
      start: new Date('2020-03-24T10:50:00+02:00'),
      end: new Date('2020-03-24T11:10:00+02:00'),
      title:
        'This is a event on mac sdsdfg asdfas asdfsa asfa asdfa asdfasdf as fasdfa sd sdfgs sdfgs sfdgsd s '
    }
  ];
  return (
    <Context defaultView={'day'}>
      <Container className="mt-5">
        <Nav />
        <Views currentTime={currentTime} events={mockevents} />
      </Container>
    </Context>
  );
}

export default Calendar;

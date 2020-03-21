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
      start: new Date('2020-03-21T04:00:00+02:00'),
      end: new Date('2020-03-21T04:30:00+02:00'),
      title: 'sdfgsdfg1asdfasfasdfsdfasdfasdfasdfasdf'
    },
    {
      start: new Date('2020-03-21T04:00:00+02:00'),
      end: new Date('2020-03-21T04:30:00+02:00'),
      title: 'sdfgsdfg1asdfasdfsdfasdfsdfasdfasdfasdf'
    },
    {
      start: new Date('2020-03-21T04:00:00+02:00'),
      end: new Date('2020-03-21T04:30:00+02:00'),
      title: 'sdfgsdfg1asdfasdasdfasdfadfasdfasdfasdf'
    },
    {
      start: new Date('2020-03-21T04:00:00+02:00'),
      end: new Date('2020-03-21T04:30:00+02:00'),
      title: 'sdfgsdfg1asdasdasdfasdfasdfasdfasdfasdf'
    },
    {
      start: new Date('2020-03-21T04:00:00+02:00'),
      end: new Date('2020-03-21T04:30:00+02:00'),
      title: 'sdfgsdfg1asdfasdfasfasdfasdfasdfadfasdf'
    },
    {
      start: new Date('2020-03-21T04:00:00+02:00'),
      end: new Date('2020-03-21T04:30:00+02:00'),
      title: 'sdfgsdfg1asdfasdfasdfsdfasdfasdfasdasdf'
    },
    {
      start: new Date('2020-03-21T04:00:00+02:00'),
      end: new Date('2020-03-21T04:30:00+02:00'),
      title: 'sdfgsdfg1asdfasdfasfasdfasdfasfasdfasdf'
    },
    {
      start: new Date('2020-03-21T04:00:00+02:00'),
      end: new Date('2020-03-21T04:30:00+02:00'),
      title: 'sdfgsdfg1asdfasdfasdfadfasdfasdfadfasdf'
    },
    {
      start: new Date('2020-03-21T04:00:00+02:00'),
      end: new Date('2020-03-21T04:30:00+02:00'),
      title: 'sdfgsdfg1asdfasdfasdfasfasdfasfasdfasdf'
    }
    // {
    //   start: new Date('2020-03-20T04:40:00+02:00'),
    //   end: new Date('2020-03-20T07:45:00+02:00'),
    //   title: 'sdfgsdfg2'
    // },
    // {
    //   start: new Date('2020-03-20T04:40:00+02:00'),
    //   end: new Date('2020-03-20T07:45:00+02:00'),
    //   title: 'sdfgsdfg3'
    // },
    // {
    //   start: new Date('2020-03-20T04:40:00+02:00'),
    //   end: new Date('2020-03-20T07:45:00+02:00'),
    //   title: 'sdfgsdfg4'
    // },
    // {
    //   start: new Date('2020-03-20T04:40:00+02:00'),
    //   end: new Date('2020-03-20T11:45:00+02:00'),
    //   title: 'sdfgsdfg6'
    // },
    // {
    //   start: new Date('2020-03-20T04:40:00+02:00'),
    //   end: new Date('2020-03-20T07:45:00+02:00'),
    //   title: 'sdfgsdfg5'
    // },
    // {
    //   start: new Date('2020-03-20T04:40:00+02:00'),
    //   end: new Date('2020-03-20T10:45:00+02:00'),
    //   title: 'sdfgsdfg7'
    // },
    // {
    //   start: new Date('2020-03-20T04:40:00+02:00'),
    //   end: new Date('2020-03-20T07:45:00+02:00'),
    //   title: 'sdfgsdf8g'
    // },
    // {
    //   start: new Date('2020-03-20T08:40:00+02:00'),
    //   end: new Date('2020-03-20T13:45:00+02:00'),
    //   title: 'sdfgsdf9g'
    // }
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

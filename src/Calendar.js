import React, { useState } from 'react'
import { Container } from 'semantic-ui-react'
import { Context } from './context/Context'
import Nav from './components/nav/Nav'
import Views from './components/views/IndexView'
import { useInterval } from 'react-use'

import 'semantic-ui-css/semantic.min.css'
import './index.css'

function Calendar({
  events = [
    // {
    //   start: new Date('2020-03-30T19:50:00+03:00'),
    //   end: new Date('2020-03-30T20:10:00+03:00'),
    //   title: 'This is a event on mac sdsdfg asdfas asdfsa asfa asdfa asdfasdf'
    // },
    // {
    //   start: new Date('2020-03-29T22:50:00+03:00'),
    //   end: new Date('2020-03-29T23:10:00+03:00'),
    //   title:
    //     'This is a event on mac sdsdfg asdfasasdf  asdfsa asfa asdfa asdfasdf'
    // },
    {
      start: new Date('2020-04-01T11:50:00+03:00'),
      end: new Date('2020-04-01T20:30:00+03:00'),
      title:
        'This is a event on mac sdsdfg asdfas asdfsa asdfasfa asdfa asdfasdf'
    }
  ]
}) {
  const onClickedEvent = e => {
    console.log(e)
  }
  const onSelect = e => {
    console.log(e)
  }
  const onNavigation = () => {}
  const onViewChange = () => {}
  const [currentTime, setCurrentTime] = useState(new Date())
  useInterval(() => {
    setCurrentTime(new Date())
  }, 5 * 60 * 1000)

  return (
    <Context defaultView={'week'}>
      <Container className='mt-5'>
        <Nav onNavigation={onNavigation} onViewChange={onViewChange} />
        <Views
          currentTime={currentTime}
          events={events}
          onSelect={onSelect}
          onClickedEvent={onClickedEvent}
        />
      </Container>
    </Context>
  )
}

export default Calendar

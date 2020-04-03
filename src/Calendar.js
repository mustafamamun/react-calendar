import React, { useState } from 'react'
import { Container } from 'semantic-ui-react'
import { Context } from './context/Context'
import Nav from './components/nav/Nav'
import Views from './components/views/IndexView'
import { useInterval } from 'react-use'

import 'semantic-ui-css/semantic.min.css'
import './style/styles.css'

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
      start: new Date('2020-04-06T11:50:00+03:00'),
      end: new Date('2020-04-06T17:30:00+03:00'),
      title:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    },
    {
      start: new Date('2020-04-06T11:50:00+03:00'),
      end: new Date('2020-04-07T17:30:00+03:00'),
      title:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
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
          disabledDays={['Sun']}
          disabledHours={[0, 1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23]}
        />
      </Container>
    </Context>
  )
}

export default Calendar

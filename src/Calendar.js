import React from 'react'
import { Container } from 'semantic-ui-react'
import { Context } from './context/Context'
import Nav from './components/nav/Nav'
import Views from './components/views/IndexView'

import 'semantic-ui-css/semantic.min.css'
import './style/styles.css'
import { getRandomColor, invertColor } from './components/utils'

function Calendar({
  events = [
    {
      start: new Date('2020-04-06T11:50:00+03:00'),
      end: new Date('2020-04-06T12:30:00+03:00'),
      title: 'A Lorem Ipsum is simply'
    },

    {
      start: new Date('2020-04-09T12:50:00+03:00'),
      end: new Date('2020-04-11T14:30:00+03:00'),
      title: 'E Lorem Ipsum is simply '
    },
    {
      start: new Date('2020-04-08T12:50:00+03:00'),
      end: new Date('2020-04-10T14:30:00+03:00'),
      title: 'B Lorem Ipsum is simply '
    },
    {
      start: new Date('2020-04-06T13:50:00+03:00'),
      end: new Date('2020-04-06T15:30:00+03:00'),
      title: 'C Lorem Ipsum is simply '
    },
    {
      start: new Date('2020-04-14T11:50:00+03:00'),
      end: new Date('2020-04-15T17:30:00+03:00'),
      title: 'D Lorem Ipsum is simply '
    },
    {
      start: new Date('2020-04-15T11:50:00+03:00'),
      end: new Date('2020-04-25T17:30:00+03:00'),
      title: 'Z Lorem Ipsum is simply '
    },
    {
      start: new Date('2020-04-15T11:50:00+03:00'),
      end: new Date('2020-04-16T17:30:00+03:00'),
      title: 'F Lorem Ipsum is simply '
    },
    {
      start: new Date('2020-04-16T11:50:00+03:00'),
      end: new Date('2020-04-17T17:30:00+03:00'),
      title: 'G Lorem Ipsum is simply '
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
  const coloredEvent = events.map(e => {
    const color = getRandomColor()
    return {
      ...e,
      calprops: {
        bgColor: color,
        color: invertColor(color)
      }
    }
  })
  return (
    <Context defaultView={'week'}>
      <Container className='mt-5'>
        <Nav onNavigation={onNavigation} onViewChange={onViewChange} />
        <Views
          events={coloredEvent}
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

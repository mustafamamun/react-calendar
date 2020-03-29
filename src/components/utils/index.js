import {
  isSameSecond,
  startOfDay,
  endOfDay,
  addMinutes,
  isAfter,
  isBefore,
  isSameMinute,
  isWithinInterval,
  getHours,
  getMinutes,
  endOfMinute,
  differenceInMinutes
} from 'date-fns'
import { isEmpty } from 'lodash'

export const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const daysFullInWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const timeSlots = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00'
]

export const getEventsOfTheDay = (day, events) => {
  return events.filter(e => {
    return (
      isSameSecond(day, e.start) ||
      (isAfter(startOfDay(day), e.start) &&
        isBefore(startOfDay(day), e.end) &&
        isAfter(endOfDay(day), e.start) &&
        isBefore(endOfDay(day), e.end)) ||
      (isAfter(e.start, startOfDay(day)) && isBefore(e.start, endOfDay(day))) ||
      (isAfter(e.end, startOfDay(day)) && isBefore(e.end, endOfDay(day)))
    )
  })
}

export const getEventIndex = events => {
  if (events.length === 0) return events
  let tmpEvents = [...events]
  let finalEvents = []
  while (tmpEvents.length > 0) {
    const firstEvt = tmpEvents.splice(0, 1)[0]
    firstEvt.calprops = {
      position: 0
    }
    const overlappingEvent = tmpEvents.filter(e => {
      return isWithinInterval(e.start, {
        start: firstEvt.start,
        end: firstEvt.end
      })
    })
    let indexedEvents = []
    overlappingEvent.map(e => {
      if (indexedEvents.length > 0) {
        const innerOverlappingEvent = indexedEvents.filter(indexedEvent => {
          return isWithinInterval(e.start, {
            start: indexedEvent.start,
            end: indexedEvent.end
          })
        })
        if (innerOverlappingEvent.length === 0) {
          indexedEvents.push({
            ...e,
            calprops: {
              position: 1
            }
          })
        } else {
          const maxPos = innerOverlappingEvent.reduce((prev, current) =>
            prev.calprops.position > current.calprops.position ? prev : current
          ).calprops.position

          indexedEvents.push({
            ...e,
            calprops: {
              position: maxPos + 1
            }
          })
        }
      } else {
        indexedEvents.push({
          ...e,
          calprops: {
            position: 1
          }
        })
      }
      return null
    })
    finalEvents = [...finalEvents, firstEvt, ...indexedEvents]
    tmpEvents.splice(0, overlappingEvent.length)
  }
  return finalEvents
}

export const getHighestIndex = e => {
  return isEmpty(e)
    ? 1
    : e.reduce((prev, current) =>
        prev.calprops.position > current.calprops.position ? prev : current
      ).calprops.position + 1
}

export const getEventOfTheSlot = (slotStart, events) => {
  const slotEnd = endOfMinute(addMinutes(slotStart, 29))
  return events.filter(e => {
    return (
      isSameSecond(slotStart, e.start) ||
      (isAfter(slotStart, e.start) &&
        isBefore(slotStart, e.end) &&
        isAfter(slotEnd, e.start) &&
        isBefore(slotEnd, e.end)) ||
      ((isAfter(e.start, slotStart) || isSameMinute(e.start, slotStart)) &&
        isBefore(e.start, slotEnd)) ||
      (isAfter(e.end, slotStart) &&
        (isBefore(e.end, slotEnd) || isSameMinute(slotEnd, e.end)))
    )
  })
}

export const addLeadingZero = value => {
  return value >= 10 ? value : `0${value}`
}

export const getEventTime = (e, slotStart) => {
  const start = isBefore(e.start, startOfDay(slotStart))
    ? `${addLeadingZero(getHours(startOfDay(slotStart)))} : ${addLeadingZero(
        getMinutes(startOfDay(slotStart))
      )}`
    : `${addLeadingZero(getHours(e.start))} : ${addLeadingZero(
        getMinutes(e.start)
      )}`

  const end = isAfter(e.end, endOfDay(slotStart))
    ? `${addLeadingZero(getHours(endOfDay(slotStart)))} : ${addLeadingZero(
        getMinutes(endOfDay(slotStart))
      )}`
    : `${addLeadingZero(getHours(e.end))} : ${addLeadingZero(
        getMinutes(e.end)
      )}`
  return `${start} - ${end}`
}

export const getHight = (start, end) => {
  const diff = differenceInMinutes(end, start)
  if (getHours(start) === getHours(end))
    return diff > 15 ? (diff < 1440 ? (diff * 24) / 30 : (1440 * 24) / 30) : 24
  else
    return diff > 15 ? (diff < 1440 ? (diff * 24) / 30 : (1440 * 24) / 30) : 50
}

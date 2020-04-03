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
  differenceInMinutes,
  isSameHour,
  getDay,
  endOfWeek,
  getDate,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMinutes
} from 'date-fns'
import { isEmpty, includes, flow, indexOf, compact, sortBy } from 'lodash'

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

export const colors = {
  warning: '#f07810'
}
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

export const getEventEndTimeForDay = (e, slotStart, disabledHours) => {
  let disableHour
  let dayEnd
  let eventEnd
  const nextDisableHour = sortBy(disabledHours).filter(
    i => i > getHours(slotStart)
  )[0]
  if (nextDisableHour) {
    disableHour = `${addLeadingZero(nextDisableHour)} : 00`
  }
  if (isAfter(e.end, endOfDay(slotStart))) {
    dayEnd = `${addLeadingZero(
      getHours(endOfDay(slotStart))
    )} : ${addLeadingZero(getMinutes(endOfDay(slotStart)))}`
  } else {
    eventEnd = `${addLeadingZero(getHours(e.end))} : ${addLeadingZero(
      getMinutes(e.end)
    )}`
  }

  return compact([disableHour, dayEnd, eventEnd]).sort()[0]
}

export const getEventTime = (e, slotStart, disabledHours) => {
  const start = isBefore(e.start, slotStart)
    ? `${addLeadingZero(getHours(slotStart))} : ${addLeadingZero(
        getMinutes(slotStart)
      )}`
    : `${addLeadingZero(getHours(e.start))} : ${addLeadingZero(
        getMinutes(e.start)
      )}`
  return `${start} - ${getEventEndTimeForDay(e, slotStart, disabledHours)}`
}

export const getHightEventDetails = (start, end, slotStart, disabledHours) => {
  let diffToDisableHour
  const startTime = isBefore(start, slotStart) ? slotStart : start
  const nextDisableHour = sortBy(disabledHours).filter(
    i => i > getHours(slotStart)
  )[0]
  if (nextDisableHour) {
    diffToDisableHour =
      (nextDisableHour - getHours(startTime)) * 60 - getMinutes(startTime)
  }
  const diffToEndofTheDay = differenceInMinutes(endOfDay(slotStart), startTime)
  const diffToEventEnd = differenceInMinutes(end, startTime)

  const diff = sortBy(
    compact([diffToDisableHour, diffToEndofTheDay, diffToEventEnd])
  )[0]

  if (isSameHour(start, end)) {
    return diff > 15 ? (diff * 24.5) / 30 : 24
  } else {
    return diff > 15 ? (diff * 24.5) / 30 : 50
  }
}

export const lastSlotOfTheDayAndOcupied = (slotStart, e) => {
  const hour = getHours(slotStart)
  const minute = getMinutes(slotStart)
  if (
    hour === 23 &&
    minute === 30 &&
    isBefore(e.start, slotStart) &&
    isAfter(e.end, addMinutes(slotStart, 30))
  ) {
    return true
  }
  return false
}

export const ifSlotSelected = (slotStart, selectedWindow) => {
  return (
    !isEmpty(selectedWindow) &&
    (isSameMinute(slotStart, selectedWindow.start) ||
      (isAfter(slotStart, selectedWindow.start) &&
        isBefore(slotStart, selectedWindow.end)))
  )
}

export const ifDayIsInDisabledArray = (disabledDays, day) => {
  return includes(disabledDays, daysInWeek[getDay(day)])
}

export const isDayDisabled = (day, disabledDays, currentTime) => {
  return (
    isBefore(day, startOfDay(currentTime)) ||
    ifDayIsInDisabledArray(disabledDays, day)
  )
}

export const ifSlotIsInDisabledTime = (
  disabledDays,
  disabledHours,
  slotStart
) => {
  return (
    includes(disabledDays, daysInWeek[getDay(slotStart)]) ||
    includes(disabledHours, getHours(slotStart))
  )
}

export const isSlotDisabled = (
  slotStart,
  currentTime,
  disabledDays,
  disabledHours
) => {
  return (
    isAfter(currentTime, slotStart) ||
    ifSlotIsInDisabledTime(disabledDays, disabledHours, slotStart)
  )
}

export const isEventStartOnDay = (e, day) => {
  return (
    isSameMinute(startOfDay(day), e.start) ||
    isWithinInterval(e.start, {
      start: startOfDay(day),
      end: endOfDay(day)
    })
  )
}

export const isEventEndOnDay = (e, day) => {
  return (
    isSameMinute(endOfDay(day), e.end) ||
    isWithinInterval(e.end, {
      start: startOfDay(day),
      end: endOfDay(day)
    })
  )
}
export const isFirstActiveDay = (day, disabledDays) => {
  return (
    !includes(disabledDays, daysInWeek[getDay(day)]) &&
    includes(disabledDays, daysInWeek[getDay(subDays(day, 1))])
  )
}
export const showEvent = (e, day, disabledDays) => {
  return (
    (isEventStartOnDay(e, day) ||
      (isSameDay(day, flow(startOfMonth, startOfWeek)(day)) &&
        isBefore(e.start, flow(startOfMonth, startOfWeek)(day))) ||
      (isSameDay(day, startOfWeek(day)) &&
        isBefore(e.start, startOfWeek(day))) ||
      isFirstActiveDay(day, disabledDays)) &&
    !includes(disabledDays, daysInWeek[getDay(day)])
  )
}

export const findDistanceToNextDisableDay = (day, disabledDays) => {
  if (isEmpty(disabledDays)) {
    return null
  }
  const sortedDisabledDaysIndex = disabledDays
    .map(i => indexOf(daysInWeek, i))
    .sort()
  const nextDisableDays = sortedDisabledDaysIndex.filter(i => i > getDay(day))
  if (isEmpty(nextDisableDays)) {
    return null
  }
  return nextDisableDays[0] - getDay(day)
}

export const findDistanceToEndofWeek = day => {
  return getDay(endOfWeek(day)) - getDay(day) + 1
}

export const findDistanceToEndofEvent = (e, day) => {
  return getDate(e.end) - getDate(day) + 1
}

export const getEventWidth = (day, e, dayWidth, disabledDays) => {
  const distance = sortBy(
    compact([
      findDistanceToNextDisableDay(day, disabledDays),
      findDistanceToEndofWeek(day),
      findDistanceToEndofEvent(e, day)
    ])
  )[0]
  return (dayWidth - 20) * distance
}

export const showEventData = (e, slotStart, disabledHours) => {
  return (
    isEventStartOnSlot(e, slotStart) ||
    isSameMinute(startOfDay(slotStart), slotStart) ||
    ifFirstActiveSlot(slotStart, disabledHours)
  )
}

export const ifFirstActiveSlot = (slotStart, disabledHours) => {
  return (
    !includes(disabledHours, getHours(slotStart)) &&
    includes(disabledHours, getHours(subMinutes(slotStart, 1)))
  )
}

export const isEventStartOnSlot = (e, slotStart) => {
  return (
    isSameSecond(slotStart, e.start) ||
    isWithinInterval(e.start, {
      start: slotStart,
      end: addMinutes(slotStart, 30)
    })
  )
}
export const isEventEndOnSlot = (e, slotStart) => {
  return (
    isSameSecond(addMinutes(slotStart, 30), e.end) ||
    isWithinInterval(e.end, {
      start: slotStart,
      end: addMinutes(slotStart, 30)
    })
  )
}

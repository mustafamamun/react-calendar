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
import {
  isEmpty,
  includes,
  flow,
  indexOf,
  compact,
  sortBy,
  range,
  find,
  get
} from 'lodash'

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

export const getEventOfTheWindow = (events, window) => {
  return events.filter(e => {
    return (
      isSameSecond(window.start, e.start) ||
      (isAfter(window.start, e.start) &&
        isBefore(window.start, e.end) &&
        isAfter(window.end, e.start) &&
        isBefore(window.end, e.end)) ||
      (isAfter(e.start, window.start) && isBefore(e.start, window.end)) ||
      (isAfter(e.end, window.start) && isBefore(e.end, window.end))
    )
  })
}

export const getEventIndex = (events, day) => {
  let time = day
  while (isBefore(time, endOfDay(day))) {
    const eventOfTheSlot = getEventOfTheSlot(time, events)
    if (!isEmpty(eventOfTheSlot)) {
      getEventWithIndex(eventOfTheSlot)
    }
    time = addMinutes(time, 30)
  }
}

export const getHighestIndex = e => {
  return isEmpty(e)
    ? 0
    : e.reduce((prev, current) =>
        prev.calprops.position > current.calprops.position ? prev : current
      ).calprops.position
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

export const getEventWithIndex = events => {
  const eventsWithIndex = []
  const getHighestIndex = events => {
    return get(
      events.reduce((prev, current) =>
        get(prev, 'calprops.position', 0) > get(current, 'calprops.position', 0)
          ? prev
          : current
      ),
      'calprops.position',
      0
    )
  }

  events.forEach((e, i) => {
    if (e.calprops.position) {
      eventsWithIndex.push(e)
    } else if (eventsWithIndex.length === 0) {
      e.calprops.position = 0
      eventsWithIndex.push(e)
    } else if (
      eventsWithIndex.length === i &&
      getHighestIndex(eventsWithIndex) + 1 === i
    ) {
      e.calprops.position = i
      eventsWithIndex.push(e)
    } else if (getHighestIndex(eventsWithIndex) >= i) {
      const missingIndex = range(eventsWithIndex.length).filter((e, i) => {
        return !find(eventsWithIndex, iE => {
          return iE.calprops.position === e
        })
      })
      e.calprops.position = missingIndex[0]
      eventsWithIndex.push(e)
    }
  })
}

export const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export const invertColor = hexcolor => {
  const color = hexcolor.substring(1)
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? 'black' : 'white'
}

import {
  isSameSecond,
  startOfDay,
  endOfDay,
  addMinutes,
  isAfter,
  isBefore,
  isSameMinute,
  isWithinInterval
} from 'date-fns';

export const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const daysFullInWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

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
];

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
];

export const getEventsOfTheDay = (day, events) => {
  return events.filter(e => {
    return (
      isSameSecond(day, new Date(e.start)) ||
      (isAfter(startOfDay(day), new Date(e.start)) &&
        isBefore(startOfDay(day), new Date(e.end)) &&
        isAfter(endOfDay(day), new Date(e.start)) &&
        isBefore(endOfDay(day), new Date(e.end))) ||
      (isAfter(new Date(e.start), startOfDay(day)) &&
        isBefore(new Date(e.start), endOfDay(day))) ||
      (isAfter(new Date(e.end), startOfDay(day)) &&
        isBefore(new Date(e.end), endOfDay(day)))
    );
  });
};

export const getEventIndex = events => {
  if (events.length === 0) return events;
  let tmpEvents = [...events];
  let finalEvents = [];
  while (tmpEvents.length > 0) {
    const firstEvt = tmpEvents.splice(0, 1)[0];
    firstEvt.calprops = {
      position: 0
    };
    const overlappingEvent = tmpEvents.filter(e => {
      return isWithinInterval(new Date(e.start), {
        start: new Date(firstEvt.start),
        end: new Date(firstEvt.end)
      });
    });
    let indexedEvents = [];
    overlappingEvent.map(e => {
      if (indexedEvents.length > 0) {
        const innerOverlappingEvent = indexedEvents.filter(indexedEvent => {
          return isWithinInterval(new Date(e.start), {
            start: new Date(indexedEvent.start),
            end: new Date(indexedEvent.end)
          });
        });
        if (innerOverlappingEvent.length === 0) {
          indexedEvents.push({
            ...e,
            calprops: {
              position: 1
            }
          });
        } else {
          const maxPos = innerOverlappingEvent.reduce((prev, current) =>
            prev.calprops.position > current.calprops.position ? prev : current
          ).calprops.position;

          indexedEvents.push({
            ...e,
            calprops: {
              position: maxPos + 1
            }
          });
        }
      } else {
        indexedEvents.push({
          ...e,
          calprops: {
            position: 1
          }
        });
      }
      return null;
    });
    finalEvents = [...finalEvents, firstEvt, ...indexedEvents];
    tmpEvents.splice(0, overlappingEvent.length);
  }
  return finalEvents;
};

export const getEventOfTheSlot = (slotStart, events) => {
  const slotEnd = addMinutes(slotStart, 30);

  return events.filter(e => {
    return (
      isSameSecond(slotStart, new Date(e.start)) ||
      (isAfter(slotStart, new Date(e.start)) &&
        isBefore(slotStart, new Date(e.end)) &&
        isAfter(slotEnd, new Date(e.start)) &&
        isBefore(slotEnd, new Date(e.end))) ||
      ((isAfter(new Date(e.start), slotStart) ||
        isSameMinute(new Date(e.start), slotStart)) &&
        isBefore(new Date(e.start), slotEnd)) ||
      (isAfter(new Date(e.end), slotStart) &&
        (isBefore(new Date(e.end), slotEnd),
        isSameMinute(slotEnd, new Date(e.end))))
    );
  });
};

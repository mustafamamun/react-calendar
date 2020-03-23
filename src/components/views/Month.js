import React, { useContext, useState, useEffect } from 'react';
import {
  eachDayOfInterval,
  isBefore,
  startOfDay,
  isSameMinute,
  isAfter,
  isSameDay,
  isWithinInterval,
  endOfDay,
  startOfMonth,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { Grid, GridColumn, GridRow } from 'semantic-ui-react';
import { getDate } from 'date-fns/esm';
import { isEmpty, sortBy, slice, flow, get } from 'lodash';

import WeekRow from '../week-row/WeekRow';
import { CalContext } from '../../context/Context';
import { getEventsOfTheDay } from '../utils';

const Month = ({ currentTime, events }) => {
  const { viewWindow, setViewWindow, setView } = useContext(CalContext);
  const [dayWidth, setDayWidth] = useState(0);
  const eachDay = eachDayOfInterval({
    start: viewWindow.start,
    end: viewWindow.end
  });
  const [selectedWindow, setSelectedWindow] = useState({});
  const onMouseClick = e => {
    e.preventDefault();
    setSelectedWindow({
      start: e.target.id,
      end: endOfDay(new Date(e.target.id)).toString()
    });
  };
  const onMouseUp = e => {
    if (!isEmpty(selectedWindow)) {
      console.log(selectedWindow);
      setSelectedWindow({});
    }
  };
  const onMouseOver = e => {
    if (
      !isEmpty(selectedWindow) &&
      e.target.id &&
      !isBefore(new Date(e.target.id), new Date(selectedWindow.start))
    ) {
      setSelectedWindow({
        ...selectedWindow,
        end: endOfDay(new Date(e.target.id)).toString()
      });
    }
    if (isBefore(new Date(e.target.id), new Date(selectedWindow.start))) {
      setSelectedWindow({
        ...selectedWindow,
        end: endOfDay(new Date(selectedWindow.start)).toString()
      });
    }
  };

  useEffect(() => {
    setDayWidth(
      get(
        document.getElementById(startOfDay(viewWindow.start)),
        'offsetWidth',
        0
      )
    );
  });

  window.onresize = () => {
    setDayWidth(
      get(
        document.getElementById(startOfDay(viewWindow.start)),
        'offsetWidth',
        0
      )
    );
  };

  const ifSlotSelected = slotStart => {
    return (
      !isEmpty(selectedWindow) &&
      (isSameMinute(slotStart, new Date(selectedWindow.start)) ||
        (isAfter(slotStart, new Date(selectedWindow.start)) &&
          isBefore(slotStart, new Date(selectedWindow.end))))
    );
  };
  const sortedEvents = sortBy(events, 'start');
  const isEventStartOnDay = (e, day) => {
    return (
      isSameMinute(startOfDay(day), new Date(e.start)) ||
      isWithinInterval(new Date(e.start), {
        start: startOfDay(day),
        end: endOfDay(day)
      })
    );
  };
  const isEventEndOnDay = (e, day) => {
    return (
      isSameMinute(endOfDay(day), new Date(e.end)) ||
      isWithinInterval(new Date(e.end), {
        start: startOfDay(day),
        end: endOfDay(day)
      })
    );
  };
  const onMoreClicked = day => {
    setViewWindow({ start: startOfDay(day), end: endOfDay(day) });
    setView('day');
  };
  const onEventClicked = e => {
    console.log(e);
  };

  return (
    <Grid columns={7}>
      <WeekRow />
      <GridRow className={'pt-0'}>
        {eachDay.map(day => {
          const date = getDate(day);
          const eventsOfTheDay = getEventsOfTheDay(day, sortedEvents);
          const firstTwoEvents = slice(eventsOfTheDay, 0, 2);
          return (
            <GridColumn
              as={'div'}
              key={day.toString()}
              id={day.toString()}
              className={`p-0 month-day ${
                isBefore(day, startOfDay(currentTime)) ? 'disable' : ''
              }
              ${
                ifSlotSelected(startOfDay(day))
                  ? 'selected'
                  : isSameDay(day, new Date())
                  ? 'same-day-month'
                  : ''
              }
              `}
              onMouseDown={onMouseClick}
              onMouseOver={onMouseOver}
              onMouseUp={onMouseUp}
            >
              <b>{date < 10 ? `0${date}` : date}</b>
              {firstTwoEvents.map(e => {
                return (
                  <div
                    onMouseDown={event => {
                      event.stopPropagation();
                      onEventClicked(e);
                    }}
                    className={`evt-base ${
                      isEventStartOnDay(e, day) ? 'event-start' : ''
                    } ${isEventEndOnDay(e, day) ? 'event-end' : ''}`}
                    key={e.title}
                  >
                    {(isEventStartOnDay(e, day) ||
                      (isSameDay(day, flow(startOfMonth, startOfWeek)(day)) &&
                        isBefore(
                          new Date(e.start),
                          flow(startOfMonth, startOfWeek)(day)
                        )) ||
                      (isSameDay(day, startOfWeek(day)) &&
                        isBefore(new Date(e.start), startOfWeek(day)))) && (
                      <div
                        style={{
                          position: 'absolute',
                          width: `${dayWidth *
                            (isBefore(endOfWeek(day), new Date(e.end))
                              ? getDate(endOfWeek(day)) - getDate(day) + 1
                              : getDate(e.end) - getDate(day) + 1) -
                            10}px`,
                          zIndex: '10000',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {e.title}
                      </div>
                    )}
                  </div>
                );
              })}
              {eventsOfTheDay.length > 2 && (
                <div
                  className={'more-events-link'}
                  onMouseDown={event => {
                    event.stopPropagation();
                    onMoreClicked(day);
                  }}
                >
                  + {eventsOfTheDay.length - 2} more events
                </div>
              )}
            </GridColumn>
          );
        })}
      </GridRow>
    </Grid>
  );
};

export default Month;

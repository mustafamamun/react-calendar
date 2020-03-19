import React, { useContext, useState } from 'react';
import {
  eachDayOfInterval,
  isBefore,
  startOfDay,
  addMinutes,
  isSameMinute,
  isAfter
} from 'date-fns';
import { Grid, GridColumn, GridRow } from 'semantic-ui-react';
import { getDate } from 'date-fns/esm';
import { isEmpty } from 'lodash';

import WeekRow from '../week-row/WeekRow';
import { CalContext } from '../../context/Context';

const Month = ({ currentTime }) => {
  const { viewWindow } = useContext(CalContext);
  const eachDay = eachDayOfInterval({
    start: viewWindow.start,
    end: viewWindow.end
  });
  const [selectedWindow, setSelectedWindow] = useState({});
  const onMouseClick = e => {
    e.preventDefault();
    setSelectedWindow({
      start: e.target.id,
      end: addMinutes(new Date(e.target.id), '30').toString()
    });
  };
  const onMouseUp = e => {
    console.log(selectedWindow);
    setSelectedWindow({});
  };
  const onMouseOver = e => {
    if (
      !isEmpty(selectedWindow) &&
      e.target.id &&
      !isBefore(new Date(e.target.id), new Date(selectedWindow.start))
    ) {
      setSelectedWindow({
        ...selectedWindow,
        end: addMinutes(new Date(e.target.id), 30).toString()
      });
    }
    if (isBefore(new Date(e.target.id), new Date(selectedWindow.start))) {
      setSelectedWindow({
        ...selectedWindow,
        end: addMinutes(new Date(selectedWindow.start), 30).toString()
      });
    }
  };

  const ifSlotSelected = slotStart => {
    return (
      !isEmpty(selectedWindow) &&
      (isSameMinute(slotStart, new Date(selectedWindow.start)) ||
        (isAfter(slotStart, new Date(selectedWindow.start)) &&
          isBefore(slotStart, new Date(selectedWindow.end))))
    );
  };

  return (
    <Grid columns={7}>
      <WeekRow />
      <GridRow className={'pt-0'}>
        {eachDay.map(day => {
          const date = getDate(day);
          return (
            <GridColumn
              as={'div'}
              key={day.toString()}
              id={day.toString()}
              className={`month-day ${
                isBefore(day, startOfDay(currentTime)) ? 'disable' : ''
              } ${ifSlotSelected(startOfDay(day)) ? 'selected' : ''}`}
              onMouseDown={onMouseClick}
              onMouseOver={onMouseOver}
              onMouseUp={onMouseUp}
            >
              <b>{date < 10 ? `0${date}` : date}</b>
            </GridColumn>
          );
        })}
      </GridRow>
    </Grid>
  );
};

export default Month;

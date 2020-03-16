import React, { useContext } from 'react';
import { eachDayOfInterval } from 'date-fns';
import { Grid, GridColumn, GridRow } from 'semantic-ui-react';

import { CalContext } from '../../context/Context';
import { getDate } from 'date-fns/esm';

const Month = () => {
  const { viewWindow } = useContext(CalContext);
  const eachDay = eachDayOfInterval({
    start: viewWindow.start,
    end: viewWindow.end
  });
  return (
    <Grid columns={7}>
      <GridRow>
        {eachDay.map(day => {
          const date = getDate(day);
          return <GridColumn>{date}</GridColumn>;
        })}
      </GridRow>
    </Grid>
  );
};

export default Month;

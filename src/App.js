import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Context } from './context/Context';
import Nav from './components/nav/Nav';
import Views from './components/views/IndexView';
import { useInterval } from 'react-use';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useInterval(() => {
    setCurrentTime(new Date());
  }, 5 * 60 * 1000);
  return (
    <Context defaultView={'week'}>
      <Container className="mt-5">
        <Nav />
        <Views currentTime={currentTime} />
      </Container>
    </Context>
  );
}

export default App;

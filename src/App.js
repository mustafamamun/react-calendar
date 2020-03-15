import React from 'react';
import { Container } from 'semantic-ui-react';
import { Context } from './context/Context';
import Nav from './components/nav/Nav';
import Views from './components/views/IndexView';

function App() {
  return (
    <Context>
      <Container className="mt-5">
        <Nav />
        <Views />
      </Container>
    </Context>
  );
}

export default App;

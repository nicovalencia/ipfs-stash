import React, { Component } from 'react';
import styled from 'styled-components';

import Header from './components/Header';
import FileList from './components/FileList';
import Flush from './components/Flush';
import StashList from './components/StashList';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 3fr 2fr;
  grid-column-gap: 20px;
`;

const FilePanel = styled.div`
`;

const StashPanel = styled.div`
  > div:last-child {
    background-color: #F4F4F4;
  }
`;

class App extends Component {
  render() {
    return (
      <div>
        <Header />

        <Container>

          <FilePanel>
            <FileList />
          </FilePanel>

          <StashPanel>
            <StashList />
          </StashPanel>

        </Container>

        <Flush />
      </div>
    );
  }
}

export default App;

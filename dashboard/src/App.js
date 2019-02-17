import React, { Component } from 'react';
import styled from 'styled-components';

import Header from './components/Header';
import FileList from './components/FileList';
import StashList from './components/StashList';

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  height: 100%;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 3fr 1fr;
  height: 100%;
`;

const FilePanel = styled.div`
  background-color: white;
  padding-right: 15px;
`;

const StashPanel = styled.div`
  background-color: #F4F4F4;
  padding: 15px;
`;

class App extends Component {
  render() {
    return (
      <Wrapper>
        <Header />

        <Container>

          <FilePanel>
            <FileList />
          </FilePanel>

          <StashPanel>
            <StashList />
          </StashPanel>

        </Container>

      </Wrapper>
    );
  }
}

export default App;

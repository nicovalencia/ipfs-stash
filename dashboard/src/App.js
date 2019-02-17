import React, { Component } from 'react';
import styled from 'styled-components';

import FileList from './components/FileList';
import Flush from './components/Flush';
import Remove from './components/Remove';
import StashList from './components/StashList';

const Header = styled.h1`
  font-size: 2rem;
  color: #0099ff;
`;

class App extends Component {
  render() {
    return (
      <div>
        <Header>Welcome to IPFS Stash Dashboard!</Header>
        <Flush />
        <Remove />
        <FileList />
        <StashList />
      </div>
    );
  }
}

export default App;

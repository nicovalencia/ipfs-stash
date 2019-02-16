import React, { Component } from 'react';
import styled from 'styled-components';

const Header = styled.h1`
  font-size: 2rem;
  color: #0099ff;
`;

class App extends Component {
  render() {
    return (
      <div>
        <Header>Welcome to IPFS Stash Dashboard!</Header>
      </div>
    );
  }
}

export default App;

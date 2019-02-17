import React from 'react';
import styled from 'styled-components';

import logo from '../logo.svg';

const Wrapper = styled.header`
  width: 100%;
  height: 74px;
  background-color: #F9F9F9;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.09);
  text-align: center;

  img {
    padding: 20px;
  }
`;

const Header = () => (
  <Wrapper>
    <img src={logo} alt="Stash Logo" />
  </Wrapper>
);

export default Header;

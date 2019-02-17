import React from 'react';
import styled from 'styled-components';

import logo from '../logo.svg';

const Wrapper = styled.header`
  position: relative;
  width: 100%;
  height: 74px;
  background-color: #F9F9F9;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.09);
  z-index: 99999;

  img {
    padding: 20px;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;

  p {
    font-size: 16px;
    color: #888888;
    letter-spacing: 0;
    text-align: right;
    padding-top: 10px;
  }

  a {
    color: #459EA2;
    text-decoration: none;
  }
`;

const Header = () => (
  <Wrapper>
    <Container>
      <img src={logo} alt="Stash Logo" />
      <p>
        Built at ETH Denver 2019 by <a href="https://www.twoscomplement.io" target="_blank">Two's Complement</a>
      </p>
    </Container>
  </Wrapper>
);

export default Header;

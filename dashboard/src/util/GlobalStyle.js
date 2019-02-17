import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
  }

  html, body {
    height: 100%;
    padding: 0;
    margin: 0;
  }

  a:focus,
  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }

  h2 {
    font-weight: 900;
    font-size: 40px;
    color: #3B3C52;
    letter-spacing: 0;
    margin: 0;
    padding-top: 40px;
    padding-left: 15px;
  }

  h3 {
    font-weight: 500;
    font-size: 22px;
    color: #888888;
    letter-spacing: 0;
    padding-top: 5px;
    margin: 0;
    padding-left: 15px;
  }

`;

export default GlobalStyle;

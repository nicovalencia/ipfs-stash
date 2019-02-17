import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';

import { createStore } from './util/store';
import { initializeApp } from './util/thunks';

// Redux Store:
const store = createStore();

console.log('%cInitializing app...', `
  font-size: 10px;
  text-transform: uppercase;
  color: #666;
`);
store.dispatch(initializeApp()).then(() => {
  console.log('%cWelcome to IPFS StashBoard!', `
    font-size: 22px;
    color: #00AD83;
  `);
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
, document.getElementById('root'));

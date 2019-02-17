import thunk from 'redux-thunk';
import { createStore as reduxCreateStore, applyMiddleware } from 'redux';

import rootReducer from './redux';

var store = {
  instance: null,
};

// Redux Store:
export function createStore() {
  store.instance = reduxCreateStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk)
  );
  return store.instance;
}

export default store;


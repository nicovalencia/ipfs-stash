import {
  createActions,
  handleActions
} from 'redux-actions';
import { combineReducers } from 'redux';

export const {

  appInitialized,

} = createActions({

  'APP_INITIALIZED': undefined,

});

const app = handleActions({

  [appInitialized]: (state) => ({
    ...state,
    isInitialized: true,
  }),

}, {
  isInitialized: false,
});

const rootReducer = combineReducers({
  app,
});

export default rootReducer;

import * as actions from './redux';

const FAKE_LOAD_DURATION = 1000;

export const initializeApp = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        dispatch(actions.appInitialized());
        resolve();
      }, 1000);
    });
  };
};


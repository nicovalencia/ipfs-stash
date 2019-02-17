import {
  createActions,
  handleActions
} from 'redux-actions';
import { combineReducers } from 'redux';

export const {

  appInitialized,

  toggleFile,
  sendFilesToStashSuccess,
  removeFilesFromStashSuccess,
  resetFiles,
  loadedFile,
  setCurrentStashName,
  loadStashesSuccess,

} = createActions({

  'APP_INITIALIZED': undefined,

  'TOGGLE_FILE': (name) => ({ name }),
  'SEND_FILES_TO_STASH_SUCCESS': undefined,
  'REMOVE_FILES_FROM_STASH_SUCCESS': undefined,
  'RESET_FILES': undefined,
  'LOADED_FILE': (file) => ({ file }),
  'SET_CURRENT_STASH_NAME': (stashName) => ({ stashName }),
  'LOAD_STASHES_SUCCESS': (stashes) => ({ stashes }),

});

const app = handleActions({

  [appInitialized]: (state) => ({
    ...state,
    isInitialized: true,
  }),

  [toggleFile]: (state, { payload: { name } }) => {

    let index = state.selectedFiles.indexOf(name);
    let nextSelectedFiles = state.selectedFiles.slice(0);

    if (index >= 0) {
      // Remove:
      nextSelectedFiles.splice(index, 1);
    } else {
      // Add:
      nextSelectedFiles.push(name);
    }

    return {
      ...state,
      selectionMode: true,
      selectedFiles: nextSelectedFiles,
    };
  },

  [sendFilesToStashSuccess]: (state) => ({
    ...state,
    selectionMode: false,
    selectedFiles: [],
  }),

  [removeFilesFromStashSuccess]: (state) => ({
    ...state,
    selectionMode: false,
    selectedFiles: [],
  }),

  [resetFiles]: (state) => ({
    ...state,
    files: {},
  }),

  [loadedFile]: (state, { payload: { file } }) => ({
    ...state,
    files: {
      ...state.files,
      [file.name]: file,
    },
  }),

  [setCurrentStashName]: (state, { payload: { stashName } }) => ({
    ...state,
    currentStashName: stashName,
  }),

  [loadStashesSuccess]: (state, { payload: { stashes } }) => ({
    ...state,
    stashes,
  }),

}, {
  isInitialized: false,
  selectionMode: false,
  selectedFiles: [],
  currentStashName: 'unstashed',
  files: {},
  stashes: {},
});

const rootReducer = combineReducers({
  app,
});

export default rootReducer;

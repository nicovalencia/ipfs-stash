import * as actions from './redux';
import { ipfs } from '../components/hoc/withIPFS';

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

export const sendFilesToStash = (stashName) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {

      let state = getState();
      let baseName = new Date().getTime(); // use time for now

      for (var i=0; i<state.app.selectedFiles.length; i++) {
        let name = state.app.selectedFiles[i];
        let hash = state.app.files[name].hash;
        await ipfs.files.cp(`/ipfs/${hash}`, `/${stashName}/${baseName++}`);
      }

      dispatch(removeFilesFromStash());

      // Unmark selected mode:
      dispatch(actions.sendFilesToStashSuccess());

      // Reload current page without moved files:
      dispatch(setActiveStash(state.app.currentStashName));

      // Reload stash meta to update count:
      dispatch(loadStashes());

      resolve();
    });
  };
};

export const removeFilesFromStash = () => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {

      let state = getState();

      for (var i=0; i<state.app.selectedFiles.length; i++) {

        let name = state.app.selectedFiles[i];
        await ipfs.files.rm(`/${state.app.currentStashName}/${name}`);

      }

      // Unmark selected mode:
      dispatch(actions.removeFilesFromStashSuccess());

      // Reload current page without removed files:
      dispatch(setActiveStash(state.app.currentStashName));

      // Reload stash meta to update count:
      dispatch(loadStashes());

      resolve();
    });
  };
};

export const setActiveStash = (stashName) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {

      let state = getState();

      // Reset active files:
      dispatch(actions.resetFiles());

      // Set currentStashName:
      dispatch(actions.setCurrentStashName(stashName));

      ipfs.files.ls(`/${stashName}`, (error, files) => {

        if (!files) {
          return false;
        }

        files.forEach(async (file) => {
          const stats = await ipfs.files.stat(`/${stashName}/${file.name}`);
          const files = await ipfs.get(stats.hash);

          var imageData = new TextDecoder("utf-8").decode(files[0].content);

          if (stats) {
            dispatch(actions.loadedFile({
              name: file.name,
              hash: stats.hash,
              imageData,
            }));
          }
        });

      });

      resolve();
    });
  };
};

export const loadStashes = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {

      window.chrome.storage.local.get(['stashNames'], async result => {
        let stashes = {};
        let stashNames = result.stashNames || [];

        for (var i=0; i<stashNames.length; i++) {
          let stashName = stashNames[i];
          stashes[stashName] = await ipfs.files.ls(`/${stashName}`);
        }

        dispatch(actions.loadStashesSuccess(stashes));

      });

      resolve();
    });
  };
};

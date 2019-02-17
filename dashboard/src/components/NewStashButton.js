import React from 'react';

import withIPFS from './hoc/withIPFS';

class NewStashButton extends React.Component {

  _add = () => {

    window.chrome.storage.local.get(['stashNames'], result => {

      let stashNames = result.stashNames || [];
      let stashName = `New Stash ${stashNames.length}`;

      console.log(result, stashNames);

      window.chrome.storage.local.set({
        stashNames: stashNames.concat(stashName),
      });

      this.props.ipfs.files.mkdir(`/${stashName}`);

      // Update parent:
      if (this.props.onUpdate) {
        this.props.onUpdate();
      }

    });

  };

  render() {
    return (
      <button onClick={this._add}>+ New</button>
    );
  }
}

export default withIPFS(NewStashButton);

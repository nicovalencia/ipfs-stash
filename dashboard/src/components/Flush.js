import React from 'react';

import withIPFS from './hoc/withIPFS';

class Flush extends React.Component {

  _flush = () => {
    this.props.ipfs.files.rm('/unstashed', { recursive: true });
    window.location.reload();
  };

  render() {
    return (
      <button onClick={this._flush}>Flush</button>
    );
  }
}

export default withIPFS(Flush);

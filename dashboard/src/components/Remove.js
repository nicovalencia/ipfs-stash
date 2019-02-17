import React from 'react';
import { connect } from 'react-redux';

import { removeFilesFromStash } from '../util/thunks';

class Remove extends React.Component {
  render() {

    if (!this.props.selectionMode) {
      return <React.Fragment />;
    }

    return (
      <button onClick={this.props.remove}>Remove</button>
    );
  }
}

const mapStateToProps = (state) => ({
  selectionMode: state.app.selectionMode,
});

const mapDispatchToProps = (dispatch) => ({
  remove: () => dispatch(removeFilesFromStash()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Remove);

import React from 'react';
import { connect } from 'react-redux';

import { sendFilesToStash, setActiveStash, loadStashes } from '../util/thunks';
import NewStashButton from './NewStashButton';

class StashList extends React.Component {

  _handleClick = (stashName) => {
    if (this.props.selectionMode) {
      this.props.sendFilesToStash(stashName);
    } else {
      this.props.setActiveStash(stashName);
    }
  };

  componentDidMount() {
    this.props.loadStashes();
    this.props.setActiveStash('unstashed');
  }

  render() {

    const { stashes } = this.props;

    return (
      <div>
        <h2>Stashes</h2>
        <NewStashButton onUpdate={() => { this.props.loadStashes(); }} />
        <ul>
          <li onClick={() => { this._handleClick('unstashed') }}>Unstashed</li>
          {Object.keys(stashes).map(stashName =>
            <li key={stashName} onClick={() => { this._handleClick(stashName) }}>
              {stashName} - {stashes[stashName].length} files
            </li>
          )}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  stashes: state.app.stashes,
  selectionMode: state.app.selectionMode,
});

const mapDispatchToProps = (dispatch) => ({
  sendFilesToStash: (stashName) => dispatch(sendFilesToStash(stashName)),
  setActiveStash: (stashName) => dispatch(setActiveStash(stashName)),
  loadStashes: () => dispatch(loadStashes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StashList);

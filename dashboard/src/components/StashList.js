import React from 'react';
import { connect } from 'react-redux';

import { sendFilesToStash, setActiveStash } from '../util/thunks';
import NewStashButton from './NewStashButton';

class StashList extends React.Component {

  state = {
    loading: true,
    stashNames: [],
  };

  _reloadStashes = () => {
    window.chrome.storage.local.get(['stashNames'], result => {
      let stashNames = result.stashNames || [];
      this.setState({
        stashNames,
        loading: false,
      });
    });
  };

  _handleClick = (stashName) => {
    if (this.props.selectionMode) {
      this.props.sendFilesToStash(stashName);
    } else {
      this.props.setActiveStash(stashName);
    }
  };

  componentDidMount() {
    this._reloadStashes();
    this.props.setActiveStash('unstashed');
  }

  render() {

    if (this.state.loading) {
      return <span>"Loading stashes..."</span>;
    }

    return (
      <div>
        <h2>Stashes</h2>
        <NewStashButton onUpdate={() => { this._reloadStashes(); }} />
        <ul>
          <li onClick={() => { this._handleClick('unstashed') }}>Unstashed</li>
          {this.state.stashNames.map(stashName =>
            <li key={stashName} onClick={() => { this._handleClick(stashName) }}>
              {stashName}
            </li>
          )}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectionMode: state.app.selectionMode,
});

const mapDispatchToProps = (dispatch) => ({
  sendFilesToStash: (stashName) => dispatch(sendFilesToStash(stashName)),
  setActiveStash: (stashName) => dispatch(setActiveStash(stashName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StashList);

import React from 'react';

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

  componentDidMount() {
    this._reloadStashes();
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
          {this.state.stashNames.map(stashName =>
            <li key={stashName}>
              {stashName}
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default StashList;

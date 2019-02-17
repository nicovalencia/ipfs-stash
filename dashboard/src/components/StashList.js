import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import add from '../add.svg';
import { sendFilesToStash, setActiveStash, loadStashes } from '../util/thunks';
import NewStashButton from './NewStashButton';

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  > div:last-child {
    padding: 25px 15px 0px 0px;
    text-align: right;
  }
`;

const Wrapper = styled.div`
  height: 100%;
`;

const List = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 15px;
  padding: 30px;
`;

const ListItem = styled.div`
  border-radius: 5px;
  border: 1px solid #D5D5D5;
  cursor: pointer;
  padding: 13px 13px 23px 25px;
  position: relative;

  ${props => props.active && `
    box-shadow: rgba(-1, 0, 0, 0.05) 0px 5px 4px;
    background-color: white;
    border: none;
  `};

  ${props => props.selectionMode && `
    &::after {
      content: "";
      position: absolute;
      margin-top: -20px;
      top: 50%;
      right: 20px;
      background-image: url(${add});
      background-repeat: no-repeat;
      background-position: center;
      width: 40px;
      height: 40px;
      opacity: 0.5;
    }
  `}

  p {
    font-weight: 900;
    font-size: 20px;
    color: #3B3C52;
    letter-spacing: 0;
    margin: 10px 0 6px;
  }

  span {
    font-weight: 500;
    font-size: 16px;
    color: #888888;
    letter-spacing: 0;
  }
`;

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

    const { stashes, currentStashName, selectionMode } = this.props;

    return (
      <Wrapper>
        <Header>
          <div>
            <h2>Stashes</h2>
            <h3>{Object.keys(stashes).length} Stashes</h3>
          </div>
          <div>
            <NewStashButton onUpdate={() => { this.props.loadStashes(); }} />
          </div>
        </Header>
        <List>
          <ListItem
            active={currentStashName === 'unstashed'}
            onClick={() => { this._handleClick('unstashed') }}
          >
            <p>Unstashed</p>
            <span>Files waiting to be organized</span>
          </ListItem>
          {Object.keys(stashes).map(stashName =>
            <ListItem
              selectionMode={selectionMode}
              key={stashName}
              onClick={() => { this._handleClick(stashName) }}
              active={currentStashName === stashName}
            >
              <p>{stashName}</p>
              <span>{stashes[stashName].length} files</span>
            </ListItem>
          )}
        </List>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  currentStashName: state.app.currentStashName,
  stashes: state.app.stashes,
  selectionMode: state.app.selectionMode,
});

const mapDispatchToProps = (dispatch) => ({
  sendFilesToStash: (stashName) => dispatch(sendFilesToStash(stashName)),
  setActiveStash: (stashName) => dispatch(setActiveStash(stashName)),
  loadStashes: () => dispatch(loadStashes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StashList);

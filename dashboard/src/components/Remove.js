import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { removeFilesFromStash } from '../util/thunks';

const Button = styled.button`
  background: #F2D2CF;
  border-radius: 33px;
  font-size: 15px;
  color: #D42F2F;
  letter-spacing: 1.15px;
  margin: 15px 0 0 15px;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
`;

class Remove extends React.Component {
  render() {

    if (!this.props.selectionMode) {
      return <React.Fragment />;
    }

    return (
      <Button onClick={this.props.remove}>Discard</Button>
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

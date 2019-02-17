import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import check from '../check.svg';
import { toggleFile } from '../util/redux';
import Remove from './Remove';

const List = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  padding-top: 30px;
`;

const ListItem = styled.div`
  position: relative;
  height: 200px;
  margin: 15px;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 18px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;

  ${props => props.selected && `
    border: 17px solid #459EA2;
    height: 166px;
    &::after {
      content: "";
      position: absolute;
      top: -7px;
      right: -10px;
      background-image: url(${check});
      background-repeat: no-repeat;
      background-position: center;
      width: 40px;
      height: 40px;
    }
  `}

  img {
    width: 230px;
  }
`;

class FileList extends React.Component {

  render() {

    let { files, currentStashName } = this.props;

    if (Object.keys(files).length === 0) {
      return <span>"Loading files..."</span>;
    }


    return (
      <div>
        <h2>{currentStashName}</h2>
        <h3>{Object.keys(files).length} in {currentStashName}</h3>

        <Remove />

        <List>
          {Object.keys(files).map(name =>
            <ListItem
              key={name}
              src={files[name].imageData}
              onClick={() => { this.props.toggleFile(name) }}
              selected={this.props.selectedFiles.indexOf(name) >= 0}
            >
            </ListItem>
          )}
        </List>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentStashName: state.app.currentStashName,
  files: state.app.files,
  selectionMode: state.app.selectionMode,
  selectedFiles: state.app.selectedFiles,
});

const mapDispatchToProps = (dispatch) => ({
  toggleFile: (name) => dispatch(toggleFile(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FileList);

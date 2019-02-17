import React from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import check from '../check.svg';
import { toggleFile } from '../util/redux';
import Remove from './Remove';

const fadeUpIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10%);
  }
  100% {
    transform: translateY(0%);
    opacity: 1;
  }
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  > div:last-child {
    padding: 40px 15px 0 0;
    text-align: right;
  }
`;

const List = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  padding-top: 30px;
`;

const ListItem = styled.div`
  position: relative;
  height: 294px;
  margin: 15px;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 18px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  opacity: 0;

  &.animate {
    animation: ${fadeUpIn} 0.5s ease-in forwards;
  }

  will-change: transform, opacity;

  ${props => props.selected && `
    border: 17px solid #459EA2;
    height: 260px;
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

  ${props => props.selectionMode && !props.selected && `
    opacity: 0.5;
  `}

  img {
    width: 230px;
  }
`;

class FileItem extends React.Component {

  state = {
    className: "",
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ className: "animate" });
    }, this.props.index * 100);
  }

  render() {
    return (
      <ListItem {...this.props} className={this.state.className} />
    );
  }

}

class FileList extends React.Component {

  render() {

    let {
      files,
      currentStashName,
      selectedFiles,
      selectionMode,
    } = this.props;

    if (Object.keys(files).length === 0) {
      return <React.Fragment />;
    }

    // Sort by time:
    let fileArray = Object.keys(files).map(name => {
      return {
        name,
        ...files[name],
      };
    });
    fileArray.sort((a, b) => b.name - a.name);

    return (
      <div>
        <Header>
          <div>
            <h2>{currentStashName}</h2>
            <h3>{fileArray.length} in {currentStashName}</h3>
          </div>
          <div>
            <Remove />
          </div>
        </Header>

        <List>
          {fileArray.map((file, index) => (
            <FileItem
              key={file.name}
              index={index}
              src={file.imageData}
              onClick={() => { this.props.toggleFile(file.name) }}
              selected={selectedFiles.indexOf(file.name) >= 0}
              selectionMode={selectionMode}
            />
          ))}
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

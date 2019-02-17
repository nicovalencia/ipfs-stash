import React from 'react';
import { connect } from 'react-redux';

import { toggleFile } from '../util/redux';

class FileList extends React.Component {

  render() {

    let { files, currentStashName } = this.props;

    if (Object.keys(files).length === 0) {
      return <span>"Loading files..."</span>;
    }


    return (
      <div>
        <h2>{currentStashName}</h2>
        <ul>
          {Object.keys(files).map(name =>
            <li key={name}>
              <img src={files[name].imageData} onClick={() => { this.props.toggleFile(name) }} />

              {this.props.selectedFiles.indexOf(name) >= 0 &&
                <span>SELECTED</span>
              }

            </li>
          )}
        </ul>
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

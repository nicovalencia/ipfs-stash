import React from 'react';
import styled from 'styled-components';

import withIPFS from './hoc/withIPFS';

const Button = styled.button`
  background: #CFEBF2;
  color: #469FA3;
  border-radius: 33px;
  letter-spacing: 1.15px;
  margin: 15px 0 0 15px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  padding: 15px 24px;
  font-size: 14px;
`;


class NewStashButton extends React.Component {

  _add = () => {

    window.chrome.storage.local.get(['stashNames'], result => {

      let stashNames = result.stashNames || [];
      let stashName = `New Stash ${stashNames.length+1}`;

      window.chrome.storage.local.set({
        stashNames: stashNames.concat(stashName),
      });

      this.props.ipfs.files.mkdir(`/${stashName}`);

      // Update parent:
      if (this.props.onUpdate) {
        this.props.onUpdate();
      }

    });

  };

  render() {
    return (
      <Button onClick={this._add}>Add</Button>
    );
  }
}

export default withIPFS(NewStashButton);

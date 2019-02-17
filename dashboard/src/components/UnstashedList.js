import React from 'react';

import withIPFS from './hoc/withIPFS';

class UnstashedList extends React.Component {

  state = {
    files: [],
  };

  componentDidMount() {

    const { ipfs } = this.props;

    ipfs.files.ls('/unstashed', (error, files) => {
      if (error) {
        console.log(error);
      }

      files.forEach(async (file) => {
        const stats = await ipfs.files.stat(`/unstashed/${file.name}`);
        const files = await ipfs.get(stats.hash);

        console.log(files);

        var decoder = new TextDecoder('utf8');
        var imageData = new TextDecoder("utf-8").decode(files[0].content);

        console.log('parsed', imageData);

        if (stats) {
          this.setState({
            files: this.state.files.concat({
              hash: stats.hash,
              imageData
            }),
          });
        }
      });

    });
  }

  render() {

    if (this.state.files.length === 0) {
      return <span>"Loading files..."</span>;
    }

    return (
      <div>
        <h2>Unstashed</h2>
        <ul>
          {this.state.files.map(file =>
            <li key={file.hash}>
              <img src={file.imageData} />
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default withIPFS(UnstashedList);

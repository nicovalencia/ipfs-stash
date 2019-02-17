import React from 'react';
import IPFS from 'ipfs-http-client';

const ipfs = new IPFS({
  host: "127.0.0.1",
  port: 5001,
  protocol: "http",
});

class UnstashedList extends React.Component {

  state = {
    files: [],
  };

  componentDidMount() {
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

export default UnstashedList;

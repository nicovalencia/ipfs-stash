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
    ipfs.files.ls('/stash', (err, files) => {
      if (err) {
        console.log(err);
      }

      console.log('ls /stash', files);

      files.forEach(async (file) => {
        const stats = await ipfs.files.stat(`/stash/${file.name}`);
        const files = await ipfs.get(stats.hash);

        console.log(files);

        var decoder = new TextDecoder('utf8');
        //var imageData = btoa(decoder.decode(files[0].content));
        var imageData = new TextDecoder("utf-8").decode(files[0].content);

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
        console.log(this.state);

    return (
      <ul>
        {this.state.files.map(file =>
          <li key={file.hash}>
            <img src={file.imageData} />
          </li>
        )}
      </ul>
    );
  }
}

export default UnstashedList;

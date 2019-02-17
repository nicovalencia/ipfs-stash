import React from 'react';
import IPFS from 'ipfs-http-client';

const ipfs = new IPFS({
  host: "127.0.0.1",
  port: 5001,
  protocol: "http",
});

function withIPFS(WrappedComponent) {
  class WithIPFS extends React.Component {
    render() {
      return <WrappedComponent {...this.props} ipfs={ipfs} />;
    }
  }
  return WithIPFS;
}

export default withIPFS;


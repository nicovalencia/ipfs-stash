import React, { Component } from 'react';
import './App.css';
import logo from './logo.svg';

class App extends Component {
  render() {
    return (
      <div>
        <div id="logo">
          <img src={logo} />
        </div>
        <a id="dashboardLink" href="/dashboard/index.html" target="_blank">Go to Dashboard</a>
      </div>
    );
  }
}

export default App;

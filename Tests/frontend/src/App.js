import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = Object.assign(
      {},
      { selectedFile: null }
    );
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
  }

  fileChangedHandler(event) {
    this.setState({selectedFile: event.target.files[0]});
  }

  uploadHandler() { 
    console.log(this.state.selectedFile);
    const localUrl = "http://localhost:3000/upload";
    const remoteUrl = 'https://1exvemgkdk.execute-api.ap-southeast-2.amazonaws.com/live/upload';
    const remoteHello = "https://1exvemgkdk.execute-api.ap-southeast-2.amazonaws.com/live/hello";
    const formData = new FormData();
    formData.append('file', this.state.selectedFile);
    fetch(remoteUrl,
    { // Your POST endpoint
      method: 'POST',
      headers: {
        "Authorization": "Bearer xx123yy123zz123",
        "x-api-key": "0mFLimr4FBadE5ysw5ecfaMubkRvym4r4Mh2zwGz",
        "Accept": "application/json",
        //'Access-Control-Allow-Origin':'*'
      }, 
      body: formData


      // method: 'GET',
      // headers: {
      //   "Authorization": "Bearer xx123yy123zz123",
      //   "x-api-key": "0mFLimr4FBadE5ysw5ecfaMubkRvym4r4Mh2zwGz",
      //   "Accept": "application/json",
      // } 
    }).then(
      response => response.json() // if the response is a JSON object
    ).then(
      success => console.log(success) // Handle the success response object
    ).catch(
      error => console.log(error) // Handle the error response object
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <input type="file" onChange={this.fileChangedHandler}></input>
          <button onClick={this.uploadHandler}>Upload!</button>
        </p>
      </div>
    );
  }
}

export default App;

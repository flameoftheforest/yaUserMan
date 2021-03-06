import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const getBase64fromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(`getBase64fromFile success.`);
      const spliced = reader.result.split(',');
      const header = spliced[0];
      spliced.shift();
      resolve({
        header: header,
        body: spliced.join('')
      });
    };
    reader.onerror = (err) => {
      console.log(`getBase64fromFile failed.`);
      reject(err);
    };
  });
}

class App extends Component {

  constructor() {
    super();
    this.state = Object.assign(
      {},
      { selectedFile: null,
        apikey: "your api key here",
        token: "your token here",
        email: "target email here",
        url: "aws-url here",
        status: ""
      }
    );
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
    this.apiKeyHandler = this.apiKeyHandler.bind(this);
    this.tokenHandler = this.tokenHandler.bind(this);
    this.emailHandler = this.emailHandler.bind(this);
    this.urlHandler = this.urlHandler.bind(this);
  }

  urlHandler(event) {
    this.setState({url: event.target.value});
  }

  fileChangedHandler(event) {
    this.setState({selectedFile: event.target.files[0]});
  }

  apiKeyHandler(event) {
    this.setState({apikey: event.target.value});
  }

  tokenHandler(event) {
    this.setState({token: event.target.value});
  }

  emailHandler(event) {
    this.setState({email: event.target.value});
  }

  uploadHandler() { 
    console.log(this.state.selectedFile);

    const selectedFile = this.state.selectedFile;
    const email = this.state.email;
    return getBase64fromFile(selectedFile)
    .then((base64Data) => {
      return {
        name: selectedFile.name,
        header: base64Data.header,
        base64: base64Data.body,
        email: email
      }
    })
    .then((body) => {
      console.log(`${JSON.stringify(body)}`);
      return body;
    })
    .then((body) => {
      this.setState({status: "Begin uploading..."});
      return fetch(this.state.url+"/upload",
      { // Your POST endpoint
        method: 'POST',
        headers: {
          "Authorization": "Bearer " + this.state.token,
          "x-api-key": this.state.apikey,
          "Accept": "application/json",
        }, 
        body: JSON.stringify(body)
      });
    })
    .then(
      response => response.json() // if the response is a JSON object
    )
    .then(
      success => {
        console.log(success); // Handle the success response object
        this.setState({
          status: success.message
        });
      }
    )
    .catch(
      error => {console.log(error) ;// Handle the error response object
        this.setState({
          status: JSON.stringify(error)
        });
      })
    ;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">File Upload Test</h1>
          <h2 className="App-title">(also tests for CORS)</h2>
        </header>
        <p>
          <input
            type="text"
            defaultValue={this.state.url}
            onChange={this.urlHandler}
          />
        </p>
        <p>
          <input
            type="text"
            defaultValue={this.state.apikey}
            onChange={this.apiKeyHandler}
          />
        </p>
        <p>
          <input
            type="text"
            defaultValue={this.state.token}
            onChange={this.tokenHandler}
          />
        </p>
        <p>
          <input
            type="text"
            defaultValue={this.state.email}
            onChange={this.emailHandler}
          />
        </p>
        <p className="App-intro">
          <input type="file" onChange={this.fileChangedHandler}></input>
          <button onClick={this.uploadHandler}>Upload!</button>
        </p>
        <p>
        <input
            type="text"
            id="output"
            readOnly={true}
            value={this.state.status}
          />
        </p>
      </div>
    );
  }
}

export default App;

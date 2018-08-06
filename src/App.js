import React, { Component } from "react";
import SimpleStorageContract from "../build/contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import ipfs from "./ipfs";

import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ipfsHash: "",
      storageValue: 0,
      web3: null,
      buffer: null
    };

    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });

        // Instantiate contract once web3 provided.
        this.instantiateContract();
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require("truffle-contract");
    const simpleStorage = contract(SimpleStorageContract);
    simpleStorage.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance;

    // Get accounts.
    // this.state.web3.eth.getAccounts((error, accounts) => {
    //   simpleStorage
    //     .deployed()
    //     .then(instance => {
    //       simpleStorageInstance = instance;

    //       // Stores a given value, 5 by default.
    //       return simpleStorageInstance.set(5, { from: accounts[0] });
    //     })
    //     .then(result => {
    //       // Get the value from the contract to prove it worked.
    //       return simpleStorageInstance.get.call(accounts[0]);
    //     })
    //     .then(result => {
    //       // Update state with the result.
    //       return this.setState({ storageValue: result.c[0] });
    //     });
    // });
  }

  captureFile(event) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  }

  onSubmit(event) {
    event.preventDefault();
    ipfs.files.add(this.state.buffer, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      this.setState({ ipfsHash: result[0].hash });
      console.log("ipfsHash", this.state.ipfsHash);
    });
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">
            IPFS Dapp{" "}
          </a>{" "}
        </nav>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1> Your Image </h1>{" "}
              <p> This image is stored on IPFS and the Ethereum Blockchain. </p>{" "}
              <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="" />
              <h2> Upload Image </h2>{" "}
              <form onSubmit={this.onSubmit}>
                <input type="file" onChange={this.captureFile} />{" "}
                <input type="submit" />
              </form>{" "}
              <p>
                If your contracts compiled and migrated successfully, below will
                show a stored value of 5(by default).{" "}
              </p>{" "}
              <p>
                Try changing the value stored on <strong> line 59 </strong> of
                App.js.{" "}
              </p>{" "}
              <p> The stored value is: {this.state.storageValue} </p>{" "}
            </div>{" "}
          </div>{" "}
        </main>{" "}
      </div>
    );
  }
}

export default App;

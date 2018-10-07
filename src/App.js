import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import DefaultLayout from './containers/DefaultLayout/DefaultLayout';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        // Instantiate contract once web3 provided.
        //this.instantiateContract()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }


  render() {
    return (
      <div>
        <DefaultLayout />
      </div>
    );
  }
}

export default App

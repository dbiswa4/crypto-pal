import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import WyreVerification from 'wyre-react-library';
import Web3Provider, { Web3Consumer, withWeb3 } from 'web3-webpacked-react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { Button } from 'reactstrap';
import LoopringTop from './LoopringTop'
import WyreTop from './WyreTop'
import Alert from 'react-s-alert';

class App extends Component {

  componentDidMount () {
    this._firstScripts()
  }

  _firstScripts = async () =>{
  }


  render() {
    return (
      <div className="App">
        <Switch>

          <Route exact path='/' render={() => (
            <WyreTop />
          )} />

          <Route exact path='/loopringTest' render={() => (
            <LoopringTop />
          )} />

        </Switch>

        <Alert stack={{limit: 3}} />

      </div>
    );
  }
}

// export default App;
export default withRouter(connect( null, null )(App))

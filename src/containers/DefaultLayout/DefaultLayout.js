import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
  AppAside,
  AppFooter,
  AppHeader,
} from '@coreui/react';
import DefaultAside from './DefaultAside';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';
import Upload from '../Upload/Upload';
import Verify from '../Verify/Verify';
import getWeb3 from '../../utils/getWeb3';
import Home from '../Home/Home';

class DefaultLayout extends Component {

  state = {}

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
      .then(results => {
        let personalAddress = results.web3.eth.coinbase.toLowerCase();
        console.log("Default Layout: personalAddress: ", personalAddress);
        this.setState({
          web3: results.web3,
          address: personalAddress
        })
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  render() {
    
    return (
      <div className="app">
        <AppHeader fixed  className="bg-primary text-white">
          <DefaultHeader address={this.state.address} />
        </AppHeader>
        <div className="app-body">
          <main className="main">
            <Router>
              <div>
                <Route exact path="/" component={Home} />
                <Route path="/upload" component={Upload} />
                <Route path="/verify" component={Verify} />
              </div>
            </Router>
          </main>
          <AppAside fixed hidden>
            <DefaultAside />
          </AppAside>
        </div>
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;

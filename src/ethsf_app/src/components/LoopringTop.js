import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Col,
  Button,
  Input,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import { WalletUtils,ethereum } from 'loopring.js'

console.log("ethereum: ", ethereum)

// LoopringTop
class LoopringTop extends Component {

  componentDidMount() {
    this.firstScript()

    // this._createAccount()
  }

  firstScript = async () => {

    console.log("WalletUtils: ", WalletUtils)

    // const web3 = window.web3 // MetaMask
    // const message = 'loopring';
    // const account = '0x48ff2269e58a373120FFdBBdEE3FBceA854AC30A';
    // const sig = await sign(web3,account, toBuffer(message))
    // console.log("sig: ", sig)
  }

  // _createAccount = async () => {
  //   const mnemnic  = WalletUtils.createMnemonic(128);
  //   const dpath = ethereum.account.path;
  //   const account =  WalletUtils.fromMnemonic(mnemnic,dpath.concat('/0'))
  //   const privateKey = WalletUtils.mnemonictoPrivatekey(mnemnic,dpath.concat('/0'))
  //   const address = account.getAddress()
  //   console.log("address: ", address)
  // }



  render() {

    return(
      <Container className='home' style={{
        textAlign: 'center',
      }}>

      {/* title */}
      <Row style={{ marginTop: 60, marginBottom:10 }}>
        <Col md="3" xs="12" />
        <Col md="6" xs="12" style={{ textAlign: 'center' }}>
          <span style={{
              color: '#000000',
              fontSize: 36,
            }}>
            loopring test
          </span>
        </Col>
        <Col md="3" xs="12" />
      </Row>

      </Container>
    )
  }
}

export default withRouter( connect(null, null)(LoopringTop) )

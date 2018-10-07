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
import 'bootstrap/dist/css/bootstrap.css';
import Web3 from 'web3';
import * as MyAPI from '../utils/MyAPI'
import Alert from 'react-s-alert';
import { Loader } from 'react-overlay-loader';
import EthUtil from 'ethereumjs-util'
import TokenJSON from '../contracts/Token.json'
import Token0JSON from '../contracts/Token0.json'
import socketIOClient from 'socket.io-client'

const BN = EthUtil.BN

let metamaskWeb3 = null;
if (typeof metamaskWeb3 !== 'undefined') {
  metamaskWeb3 = new Web3(window.web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  metamaskWeb3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

// String.prototype.hexEncode = function(){
//     var hex, i;
//
//     var result = "";
//     for (i=0; i<this.length; i++) {
//         hex = this.charCodeAt(i).toString(16);
//         result += ("000"+hex).slice(-4);
//     }
//
//     return result
// }

// convert wei in big number in to ether in 0.00
const _denormalize_wei_to_ether = ({ _wei_amount_in_bn }) => {
  const deci1 = new BN(10, 10)
  const deci2 = new BN(16, 10)
  const decimal_b = deci1.pow(deci2)
  const balance_eth_b = _wei_amount_in_bn.div(decimal_b)
  const balance_eth = parseFloat(balance_eth_b.toNumber()/100).toFixed(2)
  return balance_eth;
}

class Wyre {
    constructor(data) {
        this.data = data;
        if (data.env == null)
            data.env = "production";
        let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        let messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        window[eventMethod](messageEvent, (e) => {

          if (e && e.data ){

            const data_str = JSON.stringify(e.data)
            // console.log("data_str: ", data_str)
            let action = "data_e.action"
            if (data_str.indexOf("close") !== -1) {
              action = "close"
            } else if (data_str.indexOf("complete") !== -1) {
              action = "complete"
            }

            // switch (e.data) {
            switch (action) {
                case "close":
                    document.body.removeChild(this.iframe);
                    this.iframe = null;
                    this.data.onExit();
                    break;
                case "complete":
                    document.body.removeChild(this.iframe);
                    this.iframe = null;
                    this.data.onSuccess();
                    break;
                default:
                    // console.log(action);
            }
          }

        }, false);
        this.createIframe();
    }
    open() {
        if (!this.iframe)
            this.createIframe();
        this.iframe.style.display = "block";
    }
    createIframe() {
        this.iframe = document.createElement('iframe');
        this.iframe.style.display = "none";
        this.iframe.style.border = "none";
        this.iframe.style.width = "100%";
        this.iframe.style.height = "100%";
        this.iframe.style.position = "fixed";
        this.iframe.style.zIndex = "999999";
        this.iframe.style.top = "0";
        this.iframe.style.left = "0";
        this.iframe.style.bottom = "0";
        this.iframe.style.right = "0";
        this.iframe.style.backgroundColor = "transparent";
        this.iframe.src = this.getBaseUrl() + "/?apiKey=" + this.data.apiKey;
        document.body.appendChild(this.iframe);
    }
    getBaseUrl() {
        switch (this.data.env) {
            case "test":
                return "https://verify.testwyre.com";
            case "staging":
                return "https://verify-staging.i.sendwyre.com";
            case "local":
                return "http://localhost:8890";
            case "local_https":
                return "https://localhost:8890";
            case "production":
            default:
                return "https://verify.sendwyre.com";
        }
    }
}

const handler = new Wyre({
    apiKey: "AK-EGJTETVX-6C8TFMCX-PWP7JTB3-E8PM3VVH",
    env: "test",
    onExit: function (error) {
        if (error != null)
            console.error(error)
        else
            console.log("exited!")
    },
    onSuccess: function () {
        console.log("success!")
    }
});


const _wait_a_little = async ({ _waitTime }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve()
    }, _waitTime);
  })
}

// WyreTop
class WyreTop extends Component {

  state = {
    accounts: [],
    loading: false,
    successFlg: false,
    dai_balance: '0.00',
  }

  _socket = null;

  componentDidMount() {
    this.firstScript()

    // soket io
    this._socket = socketIOClient("http://127.0.0.1:5001")

    this._socket.on('status1', (results) => {
      console.log("socket io results: ", results)
      // this.setState({
      //   message: results.message
      // })
      if (results.type === "info") {
        Alert.info(results.message, {
          position: 'top-right',
          effect: 'slide',
          timeout: 5000
        });
      } else if (results.type === "success") {
        Alert.success(results.message, {
          position: 'top-right',
          effect: 'slide',
          timeout: 5000
        });
      } else if (results.type === "error") {
        Alert.error(results.message, {
          position: 'top-right',
          effect: 'slide',
          timeout: 5000
        });
      }
    })

    // console.log(this._socket)
  }

  firstScript = async () => {

    const accounts = await metamaskWeb3.eth.getAccounts()

    // get oken_parameters
    const dai_balance = await this._check_dai_balance({
      _web3: metamaskWeb3,
      _token_address: "0xc4375b7de8af5a38a93548eb8453a498222c4ff2",
      _from_address: "0xd3bbba23a2d1183ddf35ca04ae8f3872a96db8e7",
      _address_to_check: "0xd3bbba23a2d1183ddf35ca04ae8f3872a96db8e7",
    })
    console.log("dai_balance: ", dai_balance)


    // get oken_parameters
    const sts_balance = await this._check_sts_balance({
      _web3: metamaskWeb3,
      _token_address: "0x0fff93a556a91a907165BfB6a6C6cAC695FC33F5",
      _from_address: "0xd3bbba23a2d1183ddf35ca04ae8f3872a96db8e7",
      _address_to_check: "0x690ef2327f70e0e6591c0972729457772a1251ee",
    })
    console.log("sts_balance: ", sts_balance)


    this.setState({
      accounts: accounts,
      dai_balance: dai_balance,
    })
  }

  componentWillUnmount() {
    if (this._socket) {
      this._socket.close()
    }
  }

  // check STS token balance


  // check DAIs balance
  _check_sts_balance = async ({ _web3, _token_address, _from, _address_to_check} ) => {

    try {
      // create instance
      const token_instance = await new _web3.eth.Contract(Token0JSON, _token_address)
      const balance_wei = await token_instance.methods.balanceOf(_address_to_check).call({from: _from})
      console.log("balance_wei: ", balance_wei)
      const balance_wei_b = new BN(balance_wei, 10)
      const balance_eth = _denormalize_wei_to_ether({
        _wei_amount_in_bn: balance_wei_b
      })

      return balance_eth
    } catch (err) {
      console.log("err:", err)
      return "0.00"
    }
  }

  // check DAIs balance
  _check_dai_balance = async ({ _web3, _token_address, _from, _address_to_check} ) => {

    try {
      // create instance
      const token_instance = await new _web3.eth.Contract(TokenJSON.abi, _token_address)
      const balance_wei = await token_instance.methods.balanceOf(_address_to_check).call({from: _from})
      const balance_wei_b = new BN(balance_wei, 10)
      const balance_eth = _denormalize_wei_to_ether({
        _wei_amount_in_bn: balance_wei_b
      })

      return balance_eth
    } catch (err) {
      console.log("err:", err)
      return "0.00"
    }
  }

  _wyreClicked = async () => {
    console.log("_wyreClicked")
    handler.open();
  }

  _signMessage = ({
    timestamp,
    address_1,
  }) => {

    return new Promise((resolve, reject) => {
      metamaskWeb3.eth.sign(timestamp, address_1, (data, aaa) => {
        console.log("data: ", data, aaa)
        resolve(data)
      })
    })
  }

  // simulate alerts
  _show_alerts = async () => {

    Alert.info("Start converting 0.5 DAI into 50 TST...", {
      position: 'top-right',
      effect: 'slide',
      timeout: 5000
    });

    await _wait_a_little({ _waitTime: 3000 })

    Alert.success("DAI was successfully converted", {
      position: 'top-right',
      effect: 'slide',
      timeout: 5000
    });

    await _wait_a_little({ _waitTime: 3000 })

    Alert.info("We paid 50 TST for utility...", {
      position: 'top-right',
      effect: 'slide',
      timeout: 5000
    });

    await _wait_a_little({ _waitTime: 3000 })

    Alert.success("We record this activity on blockchain.", {
      position: 'top-right',
      effect: 'slide',
      timeout: 5000
    });

    await _wait_a_little({ _waitTime: 3000 })

  }

  _userService = async () => {

    this.setState({
      loading: true,
    })

    try {

      const { accounts } = this.state
      const address_1 = accounts[0]

      // sign message
      const timestamp = new Date().getTime().toString()
      console.log("timestamp: ", timestamp)
      console.log("address_1: ", address_1)

      const timestampHex = metamaskWeb3.utils.utf8ToHex(timestamp);
      console.log("timestampHex: ", timestampHex)

      const network_id = await metamaskWeb3.eth.net.getId()

      const signedMsg = await metamaskWeb3.eth.personal.sign( timestampHex, address_1 )
      // const signedMsg = await metamaskWeb3.eth.sign( timestamp, address_1)
      console.log("timestamp: ", timestamp)
      console.log("signedMsg: ", signedMsg)

      // show alerts
      // this._show_alerts()

      const results_1 = await MyAPI.userService({
        signer_address: address_1,
        msg: signedMsg,
        timestamp: timestamp,
        network_id: network_id,
      })
      console.log("results_1:", results_1)
      if (results_1.status !== "success") {
        throw Error(results_1.message)
      }

      this.setState({
        loading: false,
        successFlg: true,
      })

    } catch (err) {
      console.log("err: ", err)

      this.setState({
        loading: false,
      })

      Alert.error(err.message, {
        position: 'top-right',
        effect: 'slide',
        timeout: 5000
      });
      return;
    }
  }

  render() {

    const { accounts, loading, successFlg, dai_balance, } = this.state
    let address_1 = ""
    if (accounts && accounts.length > 0) {
      address_1 = accounts[0]
    }

    return(
      <Container className='home' style={{
        textAlign: 'center',
      }}>

        <Row style={{ marginTop: 60, marginBottom:20 }}>
          <Col md="3" xs="12" />
          <Col md="6" xs="12" style={{ textAlign: 'center' }}>

            <img src={require('../images/cryptoPal logo.png')} style={{
              width: '90%',
            }} alt="sotuu_icon_white" />

          </Col>
          <Col md="3" xs="12" />
        </Row>

        {/* title */}
        <Row style={{ marginTop: 20, marginBottom:20 }}>
          <Col md="3" xs="12" />
          <Col md="6" xs="12" style={{ textAlign: 'center' }}>
            <span style={{
                fontSize: 42,
                color: '#ffffff',
                fontWeight: 'bold',
                lineHeight: '48px',
              }}>
              PAY IN DOLLARS FOR YOUR <br/>
              CRYPTO SERVICES
            </span>
          </Col>
          <Col md="3" xs="12" />
        </Row>

        {/* sub title */}
        <Row style={{ marginTop: 20, marginBottom:40 }}>
          <Col md="3" xs="12" />
          <Col md="6" xs="12" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 16, color: '#ffffff', }}>
              Your easy-to-access gate to the world of cryptos.
            </span>
          </Col>
          <Col md="3" xs="12" />
        </Row>

        {/* address  */}
        <Row style={{ marginTop: 20, marginBottom:40 }}>
          <Col md="3" xs="12" />
          <Col md="4" xs="12" style={{ textAlign: 'center' }}>
            <Input type="select" name="select" id="exampleSelect">
              <option>Test Standard Token</option>
              <option>Basic Attention Token</option>
            </Input>
          </Col>
          <Col md="2" xs="12">
            <Button onClick={this._userService} style={{
                width: '100%',
              }}>
              Pay
            </Button>
          </Col>
          <Col md="3" xs="12" />
        </Row>


        {/* deposit */}
        <Row style={{ marginTop: 20, marginBottom:36 }}>
          <Col md="3" xs="12" />
          <Col md="6" xs="12" style={{ textAlign: 'center' }}>
            <Button
              className="wyrebtn"
              onClick={this._wyreClicked}
              color='secondary'
              style={{
                cursor: 'pointer',
                width: '100%',
              }}>
              Deposit
            </Button>
          </Col>
          <Col md="3" xs="12" />
        </Row>


        {/* balance */}
        <Row style={{ marginTop: 20, marginBottom:20 }}>
          <Col md="3" xs="12" />
          <Col md="6" xs="12" style={{ textAlign: 'center' }}>
            <ListGroup>

              <ListGroupItem style={{ textAlign: 'left' }}>
                <Row>
                  <Col style={{ textAlign: 'left' }}>
                    <span>DAI</span>
                  </Col>
                  <Col style={{ textAlign: 'right' }}>
                    <span>{dai_balance} DAI</span>
                  </Col>
                </Row>
              </ListGroupItem>

              <ListGroupItem style={{ textAlign: 'left' }}>
                <Row>
                  <Col style={{ textAlign: 'left' }}>
                    <span>ETHER</span>
                  </Col>
                  <Col style={{ textAlign: 'right' }}>
                    <span>0.00 ETHER</span>
                  </Col>
                </Row>
              </ListGroupItem>

            </ListGroup>

          </Col>
          <Col md="3" xs="12" />
        </Row>

        {successFlg === true && (
          <div>


            {/*<Row style={{ marginTop: 20, marginBottom:20 }}>
              <Col md="3" xs="12" />
              <Col md="6" xs="12" style={{ textAlign: 'center' }}>
                <span style={{ color: '#ffffff' }}>
                  50 TST is requested as utility fees.
                </span>
              </Col>
              <Col md="3" xs="12" />
            </Row>
            <Row style={{ marginTop: 20, marginBottom:20 }}>
              <Col md="3" xs="12" />
              <Col md="6" xs="12" style={{ textAlign: 'center' }}>
                <span style={{ color: '#ffffff' }}>
                  Exchange 0.5 DAI and 50 TST
                </span>
              </Col>
              <Col md="3" xs="12" />
            </Row>
            <Row style={{ marginTop: 20, marginBottom:20 }}>
              <Col md="3" xs="12" />
              <Col md="6" xs="12" style={{ textAlign: 'center' }}>
                <span style={{ color: '#ffffff' }}>
                  Pay 50 TST as utility
                </span>
              </Col>
              <Col md="3" xs="12" />
            </Row>
            <Row style={{ marginTop: 20, marginBottom:20 }}>
              <Col md="3" xs="12" />
              <Col md="6" xs="12" style={{ textAlign: 'center' }}>
                <span style={{ color: '#ffffff' }}>
                  record transaction on smart contracts
                </span>
              </Col>
              <Col md="3" xs="12" />
            </Row>*/}



            <Row style={{ marginTop: 30, marginBottom:20 }}>
              <Col md="3" xs="12" />
              <Col md="6" xs="12" style={{ textAlign: 'center' }}>

                <img src={require('../images/c56iv.jpg')} style={{
                  width: '100%',
                }} alt="sotuu_icon_white" />

              </Col>
              <Col md="3" xs="12" />
            </Row>


          </div>

        )}


        {/* loading */}
        <Loader fullPage={true} loading={loading} />

      </Container>
    )
  }
}

export default withRouter( connect(null, null)(WyreTop) )

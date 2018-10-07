
import Web3 from 'web3'
import EthUtil from 'ethereumjs-util'
import { scenarioAsync as fillOrderERC20 } from './0x_fill_order_erc20';

import lightwallet from 'eth-lightwallet'
import HookedWeb3Provider from 'hooked-web3-provider'

import TokenJSON from './Token.json'
import UserBalJSON from './UserBal.json'
const EthereumTx = require('ethereumjs-tx')
const childWeb3  = new Web3(
  new Web3.providers.HttpProvider("https://kovan.infura.io/9a05beba9a974345879029eedb5b1ad7")
);
// const childWeb3 = new Web3(new Web3.providers.HttpProvider("https://ratel0rpc.grabit.co"));
// const childWeb3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/9a05beba9a974345879029eedb5b1ad7"));
const REST_API_KEY = "ethsf123"
const BN = EthUtil.BN


const _normalize_amount = ({ amount }) => {
  const deci1 = new BN(10, 10)
  const deci2 = new BN(16, 10)
  const decimal_b = deci1.pow(deci2)
  const amount_b = new BN(amount * 100, 10)
  const normalized_amount = amount_b.mul(decimal_b)
  return normalized_amount;
}

// create new wallet without
const _createNewWallet = async ({ _seed_text, _password }) => {

  try {

    if (!_password) {
      throw Error("no password found")
    }

    let randomSeed = null

    if (_seed_text){
      randomSeed = _seed_text
    } else {
      let extraEntropy = shortid.generate()
      randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
    }

    // create a wallet
    const wallet = await _createVault({
      _password: _password,
      _seedPhrase: randomSeed,
    })
    console.log("wallet: ", wallet)

    // add 2 new address
    await _newAddresses({
      _wallet: wallet,
      _password: _password,
      _count: 5,
    })

    // web 3
    const { web3 } = await _setWeb3Provider({ _wallet: wallet })

    // return web3, wallet, and seed text
    return {
      web3: web3,
      wallet: wallet,
      seed_text: randomSeed,
    }

  } catch (err) {
    throw Error(err.message)
  }
}

// add new eth address
const _newAddresses = ({ _wallet, _password, _count }) => {

  if (!_wallet) {
    return Promise.reject(Error("no keystore found 2"))
  }

  if (!_password) {
    return Promise.reject(Error("no password found"))
  }

  return new Promise((resolve, reject) => {

    _wallet.keyFromPassword( _password, (err, pwDerivedKey) => {
      if (err){
        reject(err)
        return
      }
      // generate new address
      _wallet.generateNewAddress(pwDerivedKey, _count);
      resolve()
    })
  })
}


// create vault
const _createVault = ({ _password, _seedPhrase }) => {

  // metamask compatible
  const params = {
    password: _password,
    seedPhrase: _seedPhrase,
    // hdPathString: "m/0'/0'/0'",
    hdPathString: "m/44'/60'/0'/0",
  }

  return new Promise((resolve, reject) => {
    // create vault
    lightwallet.keystore.createVault(params, (err, ks) => {
      if (err){
        reject(Error(err))
      }
      resolve(ks)
    })
  })
}



// set special provider
const _setWeb3Provider = async ({ _wallet }) => {

  try {

    var web3Provider = new HookedWeb3Provider({
      host: "https://kovan.infura.io/9a05beba9a974345879029eedb5b1ad7",
      transaction_signer: _wallet
    });

    const web3 = new Web3(web3Provider);
    return web3;

  } catch (err) {
    throw Error(err.message)
  }
}

const _startScript = async () => {

  try {

    // create web3 here
    const { web3, wallet } = await _createNewWallet({
      _seed_text: "cherry dwarf loud energy open retreat hollow crowd hobby sponsor fold reveal",
      _password: "12345678"
    })
    console.log("web3: ", web3)
    console.log("wallet: ", wallet)

    // childWeb3 = web3;

    const addresses = wallet.getAddresses()
    console.log("addresses: ", addresses)

    // childWeb3 = web3;

  } catch (err) {
    console.log("err: ", err)
  }
}

// _startScript()





// check message and recover sender
const _checkSenderFromMsg = ({ _signedMsg, _origMsg, _web3 }) => {

  // create message hash
  const messageHash = _web3.utils.sha3(_origMsg)
  const messageHashx = new Buffer(messageHash.substr(2), 'hex');

  // decode message
  const sigDecoded = EthUtil.fromRpcSig(_signedMsg)
  const recoveredPub = EthUtil.ecrecover(messageHashx, sigDecoded.v, sigDecoded.r, sigDecoded.s)
  const recoveredAddress = EthUtil.pubToAddress(recoveredPub).toString('hex')

  return "0x"+recoveredAddress;
}

// check message and recover sender
const _checkSenderFromMsg2 = ({ _signedMsg, _origMsg, _web3, _network_id }) => {

  // create message hash
  const messageHash = _web3.utils.sha3(_origMsg)
  const messageHashx = new Buffer(messageHash.substr(2), 'hex');

  var r = EthUtil.toBuffer(_signedMsg.slice(0,66))
  var s = EthUtil.toBuffer('0x' + _signedMsg.slice(66,130))
  var v = EthUtil.bufferToInt(EthUtil.toBuffer('0x' + _signedMsg.slice(130,132)))
  var m = EthUtil.toBuffer(messageHashx)
  var pub = EthUtil.ecrecover(m, v, r, s)
  var adr = '0x' + EthUtil.pubToAddress(pub).toString('hex')

  // var r = EthUtil.toBuffer(_signedMsg.slice(0,66))
  // var s = EthUtil.toBuffer('0x' + _signedMsg.slice(66,130))
  // var v = EthUtil.bufferToInt(EthUtil.toBuffer('0x' + _signedMsg.slice(130,132)))
  // var m = EthUtil.toBuffer(messageHashx)
  // var pub = EthUtil.ecrecover(m, v, r, s)
  // var adr = '0x' + EthUtil.pubToAddress(pub).toString('hex')
  return adr
}


// var publicKey = ethutil.ecrecover(msgHash, (v & 1 ^ 1) + 27, r, s);

// userService
exports.userService = async (req, res) => {
  console.log("userService, 1")

  const msg =  req.body.msg;
  const signer_address = req.body.signer_address;
  const timestamp =  req.body.timestamp;
  const network_id = req.body.network_id;

  console.log("signer_address: ", signer_address)
  console.log("network_id: ", network_id)

  const api_key =  req.headers.authorization;
  if (api_key !== REST_API_KEY){
    res.json({ status: 'error', message: 'api key is invalid 2' });
    return;
  }

  // // success
  // res.json({
  //   status: 'success',
  // });
  //
  // return;

  try {

    // // create web3 here
    // const { web3, wallet } = await _createNewWallet({
    //   _seed_text: "cherry dwarf loud energy open retreat hollow crowd hobby sponsor fold reveal",
    //   _password: "12345678"
    // })
    // let childWeb3 = web3
    //
    // // await childWeb3.eth


    // check sender
    console.log("msg: ", msg)
    console.log("timestamp: ", timestamp)

    console.log ("childWeb3:",childWeb3 )

    const recovered_address = _checkSenderFromMsg2({
      _signedMsg: msg,
      _origMsg: timestamp,
      _web3: childWeb3,
      _network_id: parseInt(network_id),
    })
    console.log("recovered_address: ", recovered_address)
    if (signer_address !==  recovered_address) {
      console.log("Signiture did not match!!!!!!")
      // throw Error("Signiture did not match!!!!!!")
    }

    // const recovered_address = await childWeb3.eth.personal.ecRecover(timestamp.toString(), msg)
    // console.log("recovered_address: ", recovered_address)
    // if (signer_address !==  recovered_address) {
    //   console.log("Signiture did not match!!!!!!")
    //   // throw Error("Signiture did not match!!!!!!")
    // }

    // // EIP 515
    // const recovered_address = _checkSenderFromMsg2({
    //   _signedMsg: msg,
    //   _origMsg: timestamp,
    //   _web3: childWeb3,
    //   _network_id: parseInt(network_id),
    // })
    // console.log("recovered_address: ", recovered_address)
    //
    // const recovered_address2 = _checkSenderFromMsg({
    //   _signedMsg: msg,
    //   _origMsg: childWeb3.utils.utf8ToHex(timestamp),
    //   _web3: childWeb3
    // })
    // console.log("recovered_address2: ", recovered_address2)
    // if (recovered_address !== signer_address) {
    //   throw Error("sender is wrong")
    // }

    // const recovered_address2 = _checkSenderFromMsg({
    //   _signedMsg: msg,
    //   _origMsg: childWeb3.utils.utf8ToHex(timestamp),
    //   _web3: childWeb3
    // })
    // console.log("recovered_address2: ", recovered_address2)
    // // if (recovered_address !== signer_address) {
    // //   throw Error("sender is wrong")
    // // }

    // DAI to BAT

    // check token for service
    const { token_of_fee, amount_of_fee } = await _getTokenAndFeeAmount()

    // socket io
    req.app.io.emit('status1', {
      'message': 'Start converting from DAI to TST...',
      'token_address': token_of_fee,
      'amount': amount_of_fee,
      'token_name': 'TST',
    });
    console.log("status1 fired!")

    // convert from DAI to BAT
    const results_1 = await _convertTokenWith0x()

    // socket io
    req.app.io.emit('status1', {
      'message': 'Convert DAI to TST successfully',
      'dai': 0.1,
      'tst': amount_of_fee,
    });

    // pay for utility with token

    // okay oracle_owner_address equal to receiver ...
    // const oracle_owner_address = "0xb35dd1abd76de7a160e42be837e4e7a8aacde867"
    // nounce
    const nounce = await childWeb3.eth.getTransactionCount("0xd3bbba23a2d1183ddf35ca04ae8f3872a96db8e7")

    // any address
    const receiver = "0xb35dd1abd76de7a160e42be837e4e7a8aacde867"
    const results_2 = await _payUtilityWithToken({
      token_address: token_of_fee,
      web3: childWeb3,
      from_address: "0xd3bbba23a2d1183ddf35ca04ae8f3872a96db8e7",
      nounce: nounce,
      normalized_amount:  _normalize_amount({ amount: 5.0 }),
      receiver: "0x1d8da2d8cf9f631c1a74b97c4458305c195d1111",
      // pKey: "9c52284cd053131ae7c63834d38cc271b7a11a3fd7724385cb2253b3671e2fa7",
      pKey: "887819420379bc77a0175f5430f270f4fb63fdf0cf33ac033c5fac77bd651037",
    })

    // socket io
    req.app.io.emit('status1', {
      'message': 'Pay with TST for utility successfully',
      'tst': amount_of_fee,
    });

    // // check DAI balance
    // // get oken_parameters
    // const dai_balance_wei = await _check_dai_balance({
    //   _web3: childWeb3,
    //   _token_address: "0xc4375b7de8af5a38a93548eb8453a498222c4ff2",
    //   _from_address: "0xd3bbba23a2d1183ddf35ca04ae8f3872a96db8e7",
    //   _address_to_check: "0xd3bbba23a2d1183ddf35ca04ae8f3872a96db8e7",
    // })
    // console.log("dai_balance_wei: ", dai_balance_wei)


    // update our contract

    // nounce
    const nounce2 = await childWeb3.eth.getTransactionCount("0xd3bbba23a2d1183ddf35ca04ae8f3872a96db8e7")

    const results_3 = await _updateOurContract({
      nounce: nounce2,
      dai_balance_wei: _normalize_amount({ amount: 0.1 }),
      // pKey: "9c52284cd053131ae7c63834d38cc271b7a11a3fd7724385cb2253b3671e2fa7",
      pKey: "887819420379bc77a0175f5430f270f4fb63fdf0cf33ac033c5fac77bd651037",
      web3: childWeb3,
    })

    // socket io
    req.app.io.emit('status1', {
      'message': 'Record balance on smart contract successfully.',
    });

    // success
    res.json({
      status: 'success',
    });

  } catch (err) {
    console.log("err: ", err )

    res.json({
      status: 'error',
      message: err.message,
    });


  }
}


// check DAIs balance
const _check_dai_balance = async ({ _web3, _token_address, _from, _address_to_check} ) => {

  try {
    // create instance
    const token_instance = await new _web3.eth.Contract(TokenJSON.abi, _token_address)
    const balance_wei = await token_instance.methods.balanceOf(_address_to_check).call({from: _from})
    return balance_wei
  } catch (err) {
    console.log("err:", err)
    return "0"
  }
}

// get token and amount of this service. in real world we
// are going to have multiple utilities to pay
const _getTokenAndFeeAmount = async () => {
  // Basic Attention Token on Kovan
  return {
    token_of_fee: '0x0fff93a556a91a907165BfB6a6C6cAC695FC33F5',
    amount_of_fee: 50,
  }
}

// convert token from DAI to other with 0x
const _convertTokenWith0x = async () => {

  // let's check balance

  const maker_dai_balance_wei = await _check_dai_balance({
    _web3: childWeb3,
    _token_address: "0xc4375b7de8af5a38a93548eb8453a498222c4ff2",
    _from_address: "0xd3bbba23a2d1183ddf35ca04ae8f3872a96db8e7",
    _address_to_check: "0xd3bbba23a2d1183ddf35ca04ae8f3872a96db8e7",
  })
  console.log("maker_dai_balance_wei: ", maker_dai_balance_wei)

  const maker_need_amount = _normalize_amount({ amount: 0.1 })
  console.log("maker_need_amount: ", maker_need_amount.toString())

  const taker_tst_balance_wei = await _check_dai_balance({
    _web3: childWeb3,
    _token_address: "0x0fff93a556a91a907165BfB6a6C6cAC695FC33F5",
    _from_address: "0x690ef2327f70e0e6591c0972729457772a1251ee",
    _address_to_check: "0x690ef2327f70e0e6591c0972729457772a1251ee",
  })
  console.log("taker_tst_balance_wei: ", taker_tst_balance_wei)

  const taker_need_amount = _normalize_amount({ amount: 5.0 })
  console.log("taker_need_amount: ", taker_need_amount.toString())

  await fillOrderERC20({
    maker_address: "0xd3bbba23a2d1183ddf35ca04ae8f3872a96db8e7",
    taker_address: "0x690ef2327f70e0e6591c0972729457772a1251ee",
    maker_amount: 0.1,
    taker_amount: 5.0,
  })
}

// pay utility with token
const _payUtilityWithToken = async ({
  token_address,
  web3,
  from_address,
  nounce,
  normalized_amount,
  receiver,
  pKey,
}) => {

  try {

    // // get private key
    // const pKey = await _getPrivateKey({
    //   _password: password,
    //   _wallet: wallet,
    //   _address: address,
    // })
    const pKeyx = new Buffer(pKey, 'hex');

    // prepare token instance
    // need token
    const _instance = await new web3.eth.Contract(TokenJSON.abi, token_address)

    // get data field
    const data_field = await _instance.methods.transfer(
      receiver,
      normalized_amount.toString(),
    ).encodeABI();

    const gas_1 = 200000

    // generate raw transaction
    const txParams = {
      nonce: "0x"+nounce.toString(16),
      gasPrice: "0x"+parseInt(3000000000, 10).toString(16),
      gasLimit: "0x"+gas_1.toString(16),
      to: token_address,
      value: '0x00',
      data: data_field,
    }

    // create transaction
    var tx = new EthereumTx(txParams);
    // sign transaction
    tx.sign(pKeyx);

    // serialize transaction
    const serializedTx = tx.serialize();

    // send signed transaction
    const results_2 = await web3.eth.sendSignedTransaction("0x"+serializedTx.toString('hex'))
    console.log("results_2: ", results_2)

    return results_2

  } catch (err) {
    throw Error(err.message)
  }
}


const _updateOurContract = async ({
  nounce,
  dai_balance_wei,
  pKey,
  web3,
}) => {

  try {

    const pKeyx = new Buffer(pKey, 'hex');

    // prepare token instance
    // need token
    const _instance = await new web3.eth.Contract(UserBalJSON.abi, "0xc209d6aa28ce216ee4b85b9b97f3f808b2fcdc0f")

    // get data field
    const data_field = await _instance.methods.addOnChainHoldings(
      "DAI",
      dai_balance_wei.toString(),
    ).encodeABI();

    const gas_1 = 400000

    // generate raw transaction
    const txParams = {
      nonce: "0x"+nounce.toString(16),
      gasPrice: "0x"+parseInt(3000000000, 10).toString(16),
      gasLimit: "0x"+gas_1.toString(16),
      to: "0xc209d6aa28ce216ee4b85b9b97f3f808b2fcdc0f",
      value: '0x00',
      data: data_field,
    }

    // create transaction
    var tx = new EthereumTx(txParams);
    // sign transaction
    tx.sign(pKeyx);

    // serialize transaction
    const serializedTx = tx.serialize();

    // send signed transaction
    const results_2 = await web3.eth.sendSignedTransaction("0x"+serializedTx.toString('hex'))
    console.log("results_2: ", results_2)

    return results_2

  } catch (err) {
    throw Error(err.message)
  }
}

// import TokenJSON from '../contracts/Token.json'
//
// export const create_transafer_tx = ({
//   _web3,
//   _token_address
// }) => {
//
//   // prepare instance
//   const instance = await new _web3.eth.Contract(TokenJSON.abi, _token_address)
//
//   //  check gas
//   const param_for_token = {
//     data: SotuuTokenJSON.bytecode,
//     arguments: [
//       _token_name,
//       _token_simbol,
//       18
//     ]
//   }
//   const gas_for_deploying_token = await token_contract.deploy(param_for_token)
//   .estimateGas({
//     from: _from,
//   })
//
//
// }

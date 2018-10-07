import Web3 from 'web3'

let getWeb3 = new Promise(function (resolve, reject) {

  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function () {
    var results
    var web3 = window.web3

    // Checking if MetaMask has been installed/Enaables in the browser  
     if (!window.web3) {
       window.alert('MetaMask not installed. Please install it to start using the Dapp.');
       //console.log(" getWeb3 this: ", this)
       return;
     }

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)
      results = {
        web3: web3
      }
      console.log('getWeb3: Injected web3 detected.');
      //console.log("getWeb3: result: ", results.web3);
      resolve(results)
    } else {

      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      var provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')
      web3 = new Web3(provider)
      results = {
        web3: web3
      }
      console.log('getWeb3: No web3 instance injected, using Local web3.');
      resolve(results)
    }

     if (!web3.eth.coinbase) {
       window.alert('MetaMask is not activated. Please activate it to enter the Dapp.');
       return;
     }
    //console.log("getWeb3: this : ", this)
  })
})

export default getWeb3;

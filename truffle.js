var HDWalletProvider = require("truffle-hdwallet-provider");
 
//Please update mnemonic to be able to connect to Ropsten network.
var mnemonic = "noise....";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
  rinkeby: {
    provider: function() {
      return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/");
    },
    network_id: '4',
    gas:4500000
  },
  kovan: {
    provider: function() {
      return new HDWalletProvider(mnemonic, "https://kovan.infura.io/");
    },
    network_id: '42',
    gas:4500000
  }
}
};

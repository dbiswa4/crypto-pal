var Owned = artifacts.require("./Owned.sol");
var Mortal = artifacts.require("./Mortal.sol");
var UserBal = artifacts.require("./UserBal.sol");
var Utils = artifacts.require("./Utils.sol");

module.exports = function(deployer) {
    deployer.deploy(Owned);
    deployer.deploy(Mortal);
    deployer.deploy(Utils);
    //Link Library contracts and application contract
    deployer.link(Utils, UserBal);
    deployer.deploy(UserBal);
};

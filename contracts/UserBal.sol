pragma solidity ^0.4.24;

import "./Mortal.sol";
import "./Utils.sol";
import "installed_contracts/zeppelin/contracts/math/SafeMath.sol";

contract UserBal is Mortal{

    using SafeMath for uint256;

    uint private constant assetSymbolMaxLen = 8;
    bool private stopped = false;
    mapping(address => bool) admins;

    struct Asset {
        string assetSymbol;
        uint256 assetQuantity;
    }
    struct User {
        address addr;
        bytes32[] assetsList;
        //Asset Symbol is map key
        mapping(string => Asset) assetsMap;
    }
    //To identify user by an Ethereum address
    mapping (address => User) userHoldings;

        //To identify user by an Ethereum address
    mapping (address => User) userLockedins;

    //Events for logging
    event LogFallback(address _sender,uint _value, string _note);

    //Modifiers
    //To restrict only to owner
    modifier onlyOwner(){require(msg.sender == owner, "msg sender is not Owner"); _;}
    //To restrict only to allocated admins by owner of the contract
    modifier onlyAdmin(){require(admins[msg.sender] == true,"Sender is not Admin"); _;}
    //To pause the contract in Emergency
    modifier stopInEmergency {if (!stopped) _;}
    modifier onlyInEmergency {if (stopped) _;}

    //Circuit Breaker to pause the contract in case of Emergency
    function toggleContractActive() public 
    onlyOwner {
        stopped = !stopped;
    }

    /** @dev Fetch a particular token bal
        * @param _str symbol
        * @return uploadChoices constant.
        */
    function isStringAcceptable(string _str) 
    public
    pure
    returns(bool) {
        if (Utils.utfStringLength(_str) <= assetSymbolMaxLen) {
            return true;
        }
        return false;
    }

    /** @dev Fetch one particular token bal
        * @param _assetSymbol symbol
        * @return uploadChoices constant.
        */
    function getTokenBal(string _assetSymbol) public 
    view
    returns(uint256){
        if (!isStringAcceptable(_assetSymbol)) {
            return 0;
        }
        if (userHoldings[msg.sender].assetsMap[_assetSymbol].assetQuantity == 0) {
            return 0;
        } 
        return userHoldings[msg.sender].assetsMap[_assetSymbol].assetQuantity;
    }

    /** @dev Fetch all token balance
        * @return Array of struct containing asset symbol and quantity
        */
    
    function getAvailableTokens() public 
    view
    returns(bytes32[]){
        return userHoldings[msg.sender].assetsList;
    }
    

    /** @dev Check whether user has sufficent balance of a particulat token
        * @return bool
        */
    function isSufficientBal(string _assetSymbol, uint256 _withdrwalQuantity) public 
    view
    returns(bool){
        uint256 bal = userHoldings[msg.sender].assetsMap[_assetSymbol].assetQuantity;
        if (bal.sub(_withdrwalQuantity) > 0)
            return true;
        return false;
    }

    function useHoldings(string _assetSymbol,uint256 _withdrwalQuantity) 
    public
    returns(bool) {
        userHoldings[msg.sender].addr = msg.sender;
        uint256 curBal = userHoldings[msg.sender].assetsMap[_assetSymbol].assetQuantity;
        require(curBal.sub(_withdrwalQuantity) >= 0, "Remainder balance should be greater than Zero");
        userHoldings[msg.sender].assetsMap[_assetSymbol] = Asset(_assetSymbol, curBal.sub(_withdrwalQuantity));
        return true;
    }

    function addOnChainHoldings(string _assetSymbol, uint256 _quantity) 
    public
    returns(uint256) {
        userHoldings[msg.sender].addr = msg.sender;
        userHoldings[msg.sender].assetsList.push(Utils.stringToBytes32(_assetSymbol));
        userHoldings[msg.sender].assetsMap[_assetSymbol] = Asset(_assetSymbol, _quantity);
        //Return current balance
        return userHoldings[msg.sender].assetsMap[_assetSymbol].assetQuantity;
    }

    /** @dev Returns current balance in the contract
        * Allows the owner to withdraw funds sent to the contract account when required
        * Contract needs to be paused before owner can withdrwa funds though
        */
    function withdrawFunds() public 
    onlyOwner 
    onlyInEmergency
    returns(bool){
        uint bal = address(this).balance;
        msg.sender.transfer(bal);
        return true;
    }

    /** @dev Returns current balance in the contract
        * Just in case someone sends Ether to the contract address 
        * we should be able to check how much balance are there
        */
    function checkBalance() 
    public 
    view
    returns(uint) {
        return address(this).balance;
    }
    /** @dev Fallback function
        * If someone sends Ether to this contract, it will be accepted
        */
    function () public payable {         
        //Secutiry measure to stop user to send any malicious content alongwith the transaction
        require(msg.data.length == 0,"oops!!! Data length should be zero");         
        emit LogFallback(msg.sender,msg.value, "Thank You!!!");     
    }

}
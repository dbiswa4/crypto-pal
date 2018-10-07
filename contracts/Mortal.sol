pragma solidity ^0.4.18;

contract Owned {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }
}

//Inheritence
contract Mortal is Owned {

    //To ensure only owner can kill the contract deployed
    function kill() public {
        require(msg.sender == owner, "Only owner can kill the contract");
        //Return the balance Ether in the contract to the Owner of the contract
        selfdestruct(owner);
    }
}

var Mortal = artifacts.require('Mortal.sol');

contract('Tests for Mortal Contract',function(accounts){

    //Test - Owner should be the account which deploye the contract
    it('Test owner access',function(){
        return Mortal.deployed().then( function(instance){
            return instance.owner.call({from:accounts[0]});
        }).then(function(result) {
            let expected = accounts[0]
            let actual = result
            assert.equal(actual,expected,'owner should be  ' + expected + 'for successful execution');
        })  
    });

    //Negative test of previous test case
    it('Contract owner : negative condition',function(){
        return Mortal.deployed().then( instance => {
            return instance.owner.call({from:accounts[1]});
        }).then(result=>{
            let expected = accounts[1];
            let actual = result;
            assert.notEqual(actual,expected,'A test with other address than owners address');
        })
    });

    //No one other than owner should be able to kill the contract
    it('Kill function negative condition : a call not from owner',function(){
        return Mortal.deployed().then(instance=>{
            return instance.kill({from:accounts[1]});
        }).then(result =>{
            assert.equal(1,2,'Kill function will throw exception as the call is not from owner');
        }).catch(error =>{
            assert.include(error.message,'VM Exception while processing transaction: revert','Mortal kill function should throw exception');
        })
    });

    //Only owner should be able to kill the contract
    it('Kill function : caller is owner',function(){
        return Mortal.deployed().then(instance=>{
            return instance.kill({from:accounts[0]});
        }).catch(error =>{
            assert.equal(1,1,'Contract should be killed without any exception');
        })
    });
})

//Test self destruct functionality
contract('Self destruct',function(accounts){
    it('self destruct testing',function(){
        return Mortal.deployed().then(instance=>{
            instance.kill({from:accounts[0]})
            return instance.owner.call({from:accounts[0]})
        }).then(result =>{
            assert.equal(1,2,"Mortal got killed,  instance does not exist")
        }).catch(error =>{
            assert.include(error.message,'is not a contract address','Mortal contract instance should not exist')
        })
    });
})
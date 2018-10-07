var Utils = artifacts.require('Utils.sol');

contract('Tests for Utils Library',function(accounts){

        //Testing string length utility function
        it('Test String length check method',function(){
            return Utils.deployed().then( function(instance){
                return instance.utfStringLength.call('validation',{from:accounts[0]});
            }).then(function(result) {
                let expected = 10
                let actual = result
                assert.equal(actual,expected,'Calculated length macthes with actual length 10');
            })  
        });

})
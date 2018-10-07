var UserBal = artifacts.require('UserBal.sol')

contract('UserBal contract functionalities testing', function(accounts){

    //Test#1
   it('Test : User Balance should be 0',function(){
        return UserBal.deployed().then(function(instance){
            let assetSymbol = "DAI";
            return instance.getTokenBal.call(assetSymbol,{from:accounts[1]})
        }).then(function(result){
            let expected = 0;
            let actual = result;
            assert.equal( actual,expected,'User Token balance should be zero');
        })
    });

        //Test#2
        it('Test : Add holdings of an User',function(){
            let assetSymbol = "DAI";
            let quantity = 5;
            return UserBal.deployed().then(function(instance){
                instance.addOnChainHoldings(assetSymbol,quantity,{from:accounts[0]});
                return instance.getTokenBal.call(assetSymbol,{from:accounts[0]})
            }).then(function(result){
                let expected = 5;
                let actual = result;
                assert.equal( actual,expected,'Coins allocation successful');
            })
        });

        //Test#3
        it('Test : Update coin holdings',function(){
            let assetSymbol = "DAI";
            let withdrwalQuantity = 2;
            return UserBal.deployed().then(function(instance){
                instance.updateOnChainHoldings(assetSymbol,withdrwalQuantity,{from:accounts[0]});
                return instance.getTokenBal.call(assetSymbol,{from:accounts[0]})
            }).then(function(result){
                let expected = 3;
                let actual = result;
                assert.equal( actual,expected,'Coin Holdings updated');
            })
        });

})
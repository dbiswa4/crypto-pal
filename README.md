# CryptoPal 

## Inspiration
Foster adoption of crypto services and products by non-tech-savvy consumers. 

One of the limiting factors for crypto-based services / products mass adoption today is the need for users to understand how the inner mechanics of blockchain work - at least to a certain extent.

Let’s face it: if you want to start using crypto powered products and services, in the best case scenario you need to go on coinbase and buy ETH or BTC, transfer them to Binance or another centralized / decentralized exchange and buy the tokens you need for the service of your choice. After that, you need to transfer the tokens bought to the platform of your interest in order to use their service. That’s not trivial for most people outside of this room. 

## What it does
Our goal is to open up this market, making it easily usable for the average, non-tech user. CryptoPal makes users buy crypto services in their native tokens using USD (and other major currencies in the future) without ever needing to know that the services they’re using and paying for are crypto-based.

## How we built it
We developed a fiat proxy, integrated with Wyre for KYC / AML verification, that is supported by a stable coin - in our case DAI. We then deployed a smart contract to keep track of balances and integrated it with 0x DEX in order to buy the crypto needed for the service the user decides to buy. With the balance of the token, we then proceed to the payment of the crypto-based service.

## Challenges we ran into
Integration with DEX - because of the logic and how it works.

## Accomplishments that we're proud of
Creating fiat proxy based on Wyre - one of the prizes ;) ;) ;)

## What we learned
Integrations, knowledge about a plethora of new alternative protocols and startups that are creating the infrastructure needed to make the creation of apps faster and more secure.

## What's next for crypto-pal
Integration with major crypto-based services;
Increase of supported currencies (EUR, GBP, CHY);
Contract holding balances (as a wallet service) and doing payments automatically when requested.

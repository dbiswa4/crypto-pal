import {
    assetDataUtils,
    BigNumber,
    ContractWrappers,
    generatePseudoRandomSalt,
    Order,
    orderHashUtils,
    signatureUtils,
    SignerType,
} from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';

// import { NETWORK_CONFIGS, TX_DEFAULTS } from '../configs';
// import { DECIMALS, NULL_ADDRESS, ZERO } from '../constants';
// import { PrintUtils } from '../print_utils';
import { providerEngine } from './0x_provider_engine';
import { getRandomFutureDateInSeconds } from './0x_utils';

const KOVAN_NETWORK_ID = 42;
const GANACHE_NETWORK_ID = 50;

const NETWORK_CONFIGS = {
    rpcUrl: 'https://kovan.infura.io/',
    networkId: KOVAN_NETWORK_ID,
    // rpcUrl: 'http://127.0.0.1:8545',
    // networkId: GANACHE_NETWORK_ID,
};
const TX_DEFAULTS = { gas: 400000 };
const DECIMALS = 18;
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const ZERO = new BigNumber(0);
// console.log("providerEngine: ", providerEngine)


/**
 * In this scenario, the maker creates and signs an order for selling ZRX for BAT.
 * The taker takes this order and fills it via the 0x Exchange contract.
 */
export const scenarioAsync = async () => {
    // PrintUtils.printScenario('Fill Order');
    // Initialize the ContractWrappers, this provides helper functions around calling
    // 0x contracts as well as ERC20/ERC721 token contracts on the blockchain
    const contractWrappers = new ContractWrappers(providerEngine, { networkId: NETWORK_CONFIGS.networkId });
    // Initialize the Web3Wrapper, this provides helper functions around fetching
    // account information, balances, general contract logs
    const web3Wrapper = new Web3Wrapper(providerEngine);
    // const [maker, taker] = await web3Wrapper.getAvailableAddressesAsync();
    // const zrxTokenAddress = contractWrappers.exchange.getZRXTokenAddress();

    const maker = "0xd3bbba23a2d1183ddf35ca04ae8f3872a96db8e7"
    const taker = "0x690ef2327f70e0e6591c0972729457772a1251ee"

    console.log("maker: ", maker)
    console.log("taker: ", taker)

    // DAI on Kovan
    const daiTokenAddress = "0xbd2f0a14d6077fa5cfa63f757429800bfe241d52"
    // const daiTokenAddress = "0xf22469f31527adc53284441bae1665a7b9214dba"

    // const etherTokenAddress = contractWrappers.etherToken.getContractAddressIfExists();
    const etherTokenAddress = "0x0fff93a556a91a907165BfB6a6C6cAC695FC33F5"
    console.log("daiTokenAddress: ", daiTokenAddress)
    console.log("etherTokenAddress: ", etherTokenAddress)

    if (!etherTokenAddress) {
        throw new Error('Ether Token not found on this network');
    }

    console.log("step 1 1")

    // the amount the maker is selling of maker asset
    const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.5), DECIMALS);
    console.log("makerAssetAmount: ", makerAssetAmount.toNumber())
    // the amount the maker wants of taker asset
    // const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.1), DECIMALS);
    const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(50.0), DECIMALS);
    console.log("takerAssetAmount: ", takerAssetAmount.toNumber())
    // 0x v2 uses hex encoded asset data strings to encode all the information needed to identify an asset
    const makerAssetData = assetDataUtils.encodeERC20AssetData(daiTokenAddress);
    const takerAssetData = assetDataUtils.encodeERC20AssetData(etherTokenAddress);
    let txHash;
    let txReceipt;

    console.log("step 1 2")
    // console.log("contractWrappers.erc20Token: ", contractWrappers.erc20Token)

    // Allow the 0x ERC20 Proxy to move ZRX on behalf of makerAccount
    const makerZRXApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
        daiTokenAddress,
        maker,
    );
    // await printUtils.awaitTransactionMinedSpinnerAsync('Maker ZRX Approval', makerZRXApprovalTxHash);

    console.log("step 1 3")

    // Allow the 0x ERC20 Proxy to move BAT on behalf of takerAccount
    const takerBATApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
        etherTokenAddress,
        taker,
    );
    // await printUtils.awaitTransactionMinedSpinnerAsync('Taker BAT Approval', takerBATApprovalTxHash);

    console.log("step 1 4")

    // Convert ETH into BAT for taker by depositing ETH into the BAT contract
    const takerBATDepositTxHash = await contractWrappers.etherToken.depositAsync(
        etherTokenAddress,
        takerAssetAmount,
        taker,
    );
    // await printUtils.awaitTransactionMinedSpinnerAsync('Taker BAT Deposit', takerBATDepositTxHash);

    // PrintUtils.printData('Setup', [
    //     ['Maker ZRX Approval', makerZRXApprovalTxHash],
    //     ['Taker BAT Approval', takerBATApprovalTxHash],
    //     ['Taker BAT Deposit', takerBATDepositTxHash],
    // ]);

    console.log("step 1 5")

    // Set up the Order and fill it
    const randomExpiration = getRandomFutureDateInSeconds();
    const exchangeAddress = contractWrappers.exchange.getContractAddress();

    // Create the order
    const order = {
        exchangeAddress,
        makerAddress: maker,
        takerAddress: NULL_ADDRESS,
        senderAddress: NULL_ADDRESS,
        feeRecipientAddress: NULL_ADDRESS,
        expirationTimeSeconds: randomExpiration,
        salt: generatePseudoRandomSalt(),
        makerAssetAmount,
        takerAssetAmount,
        makerAssetData,
        takerAssetData,
        makerFee: ZERO,
        takerFee: ZERO,
    };

    console.log("step 1 6")

    // printUtils.printOrder(order);

    // // Print out the Balances and Allowances
    // await printUtils.fetchAndPrintContractAllowancesAsync();
    // await printUtils.fetchAndPrintContractBalancesAsync();

    // Generate the order hash and sign it
    const orderHashHex = orderHashUtils.getOrderHashHex(order);
    const signature = await signatureUtils.ecSignOrderHashAsync(
        providerEngine,
        orderHashHex,
        maker,
        SignerType.Default,
    );
    const signedOrder = { ...order, signature };

    console.log("====")
    console.log("maker: ", maker)
    console.log("taker: ", taker)
    console.log("====")


    // Validate the order is Fillable before calling fillOrder
    // This checks both the maker and taker balances and allowances to ensure it is fillable
    // up to takerAssetAmount
    await contractWrappers.exchange.validateFillOrderThrowIfInvalidAsync(signedOrder, takerAssetAmount, taker);

    console.log("aaa 1")

    // Fill the Order via 0x Exchange contract
    txHash = await contractWrappers.exchange.fillOrderAsync(signedOrder, takerAssetAmount, taker, {
        gasLimit: TX_DEFAULTS.gas,
    });

    console.log("aaa 2:", txHash)

    // txReceipt = await printUtils.awaitTransactionMinedSpinnerAsync('fillOrder', txHash);
    // printUtils.printTransaction('fillOrder', txReceipt, [['orderHash', orderHashHex]]);

    console.log("orderHash: ", orderHash)
    console.log("orderHashHex: ", orderHashHex)

    // // Print the Balances
    // await printUtils.fetchAndPrintContractBalancesAsync();

    // Stop the Provider Engine
    providerEngine.stop();
}

// void (async () => {
//     try {
//         if (!module.parent) {
//             await scenarioAsync();
//         }
//     } catch (e) {
//         console.log(e);
//         providerEngine.stop();
//         process.exit(1);
//     }
// })();

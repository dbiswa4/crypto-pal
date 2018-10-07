import { RPCSubprovider, Web3ProviderEngine } from '0x.js';
import { MnemonicWalletSubprovider } from '@0xproject/subproviders';

const GANACHE_NETWORK_ID = 50;
const KOVAN_NETWORK_ID = 42;

// import { BASE_DERIVATION_PATH, MNEMONIC, NETWORK_CONFIGS } from './configs';
const BASE_DERIVATION_PATH = `44'/60'/0'/0`;
// export const MNEMONIC = 'concert load couple harbor equip island argue ramp clarify fence smart topic';
export const MNEMONIC = 'cherry dwarf loud energy open retreat hollow crowd hobby sponsor fold reveal';
export const NETWORK_CONFIGS = {
  rpcUrl: 'https://kovan.infura.io/',
  networkId: KOVAN_NETWORK_ID,
  // rpcUrl: 'http://127.0.0.1:8545',
  // networkId: GANACHE_NETWORK_ID,
};

export const mnemonicWallet = new MnemonicWalletSubprovider({
    mnemonic: MNEMONIC,
    baseDerivationPath: BASE_DERIVATION_PATH,
});

export const pe = new Web3ProviderEngine();
pe.addProvider(mnemonicWallet);
pe.addProvider(new RPCSubprovider(NETWORK_CONFIGS.rpcUrl));
pe.start();

export const providerEngine = pe;

const CONFIG = {};

process.env.TESTNET = false;

CONFIG.APP_VERSION = '1.0.1 (22)';
CONFIG.BUILD_NUMBER = 22;
CONFIG.TESTNET = process.env.TESTNET;
CONFIG.DEFAULT_DERIVATION_KEY = 0;
CONFIG.PIN_ANDROID_TIMEOUT = 180; // seconds
CONFIG.BALANCE_TIMEOUT = 10; // seconds
CONFIG.NEW_ASSET_DESCRIPTOR_VERSION = 1;

export default CONFIG;

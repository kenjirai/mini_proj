const path = require("path");var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "voice attitude truth aware diary pudding bottom blossom fun hard must merry";
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    }
  },
  ropsten: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider(mnemonic,"https://ropsten.infura.io/GZrcaTpu3GAMhJAsE5H2 "),
      network_id: '3',
    },
  local: {
    provider: () =>
      new HDWalletProvider(mnemonic,"http://127.0.0.1:8545"),
    network_id: '*',
  }
};

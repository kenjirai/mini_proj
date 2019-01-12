var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var SignTheDoc = artifacts.require("./SignTheDoc.sol");

module.exports = function(deployer) {
  deployer.deploy(SignTheDoc);
};

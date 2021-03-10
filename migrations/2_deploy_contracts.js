const Game = artifacts.require("Game");

module.exports = function (deployer, network, accounts) {
    deployer.deploy(Game, { from: accounts[0] });
};
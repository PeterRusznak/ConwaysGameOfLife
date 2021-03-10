pragma solidity 0.6.6;

pragma solidity 0.6.6;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

contract Game is VRFConsumerBase {
    uint256 internal fee;

    //Network: Rinkeby
    address constant VFRC_address = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B; // VRF Coordinator
    address constant LINK_address = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709; // LINK token

    bytes32 internal constant keyHash =
        0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;

    event Result(uint256 randomResult, uint256 time);

    /**
     * Constructor inherits VRFConsumerBase
     */
    constructor() public VRFConsumerBase(VFRC_address, LINK_address) {
        fee = 0.1 * 10**18; // 0.1 LINK
    }

    /**
     * Requests randomness from a user-provided seed
     */
    function getRandomNumber(uint256 userProvidedSeed)
        public
        returns (bytes32 requestId)
    {
        require(
            LINK.balanceOf(address(this)) > fee,
            "Not enough LINK - fill contract with faucet"
        );
        return requestRandomness(keyHash, fee, userProvidedSeed);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        emit Result(randomness, block.timestamp);
    }
}

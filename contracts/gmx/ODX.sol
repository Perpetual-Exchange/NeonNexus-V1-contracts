// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "../tokens/MintableBaseToken.sol";

contract ODX is MintableBaseToken {
    constructor() public MintableBaseToken("ODX", "ODX", 0) {
    }

    function id() external pure returns (string memory _name) {
        return "ODX";
    }
}

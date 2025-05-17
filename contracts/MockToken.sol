// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    uint8 private constant _decimals = 18;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000000 * (10 ** _decimals));
    }

    function decimals() public pure override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract Remittance {
    address public stablecoin;

    struct Transfer {
        address sender;
        address recipient;
        uint256 amount;         // In stablecoin
        uint256 fxRate;         // e.g., 11345 represents 113.45
        string sourceCurrency;  // e.g., "USD"
        string targetCurrency;  // e.g., "NGN"
        bool withdrawn;
    }

    uint256 public transferCount;
    mapping(uint256 => Transfer) public transfers;

    event TransferInitiated(
        uint256 indexed transferId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        uint256 fxRate,
        string sourceCurrency,
        string targetCurrency
    );

    event Withdrawn(uint256 indexed transferId, address indexed recipient, uint256 amount);

    constructor(address _stablecoin) {
        stablecoin = _stablecoin;
    }

    /// @notice Sends funds to a recipient wallet (auto-generated on frontend)
    /// @param recipient Wallet address of the receiver
    /// @param amount Amount in stablecoin smallest unit (e.g., 10 USDC = 10_000_000)
    /// @param fxRate Exchange rate multiplied by 100 (e.g., 113.45 => 11345)
    /// @param sourceCurrency 3-letter source currency code (e.g., "USD")
    /// @param targetCurrency 3-letter target currency code (e.g., "NGN")
    function sendRemittance(
        address recipient,
        uint256 amount,
        uint256 fxRate,
        string calldata sourceCurrency,
        string calldata targetCurrency
    ) external {
        require(amount > 0, "Amount must be > 0");

        // Pull funds from sender's wallet
        bool success = IERC20(stablecoin).transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer failed");

        // Record transfer
        uint256 id = transferCount++;
        transfers[id] = Transfer({
            sender: msg.sender,
            recipient: recipient,
            amount: amount,
            fxRate: fxRate,
            sourceCurrency: sourceCurrency,
            targetCurrency: targetCurrency,
            withdrawn: false
        });

        emit TransferInitiated(id, msg.sender, recipient, amount, fxRate, sourceCurrency, targetCurrency);
    }

    /// @notice Allows recipient to withdraw their funds
    /// @param transferId The ID of the remittance transfer
    function withdraw(uint256 transferId) external {
        Transfer storage t = transfers[transferId];

        require(msg.sender == t.recipient, "Not the recipient");
        require(!t.withdrawn, "Already withdrawn");

        t.withdrawn = true;
        bool success = IERC20(stablecoin).transfer(t.recipient, t.amount);
        require(success, "Withdrawal failed");

        emit Withdrawn(transferId, t.recipient, t.amount);
    }

    /// @notice View all details of a remittance
    function getTransfer(uint256 transferId) external view returns (Transfer memory) {
        return transfers[transferId];
    }
}
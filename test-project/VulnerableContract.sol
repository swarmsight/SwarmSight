// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableContract {
    mapping(address => uint256) public balances;
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    // Potential reentrancy vulnerability
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // External call before state change (vulnerability)
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        // State change after external call (reentrancy vulnerability)
        balances[msg.sender] -= amount;
    }
    
    // Potential integer overflow (if using older Solidity)
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    // Unprotected function (no access control)
    function emergencyWithdraw() public {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    // Potential gas limit issues
    function massTransfer(address[] memory recipients, uint256 amount) public {
        for (uint i = 0; i < recipients.length; i++) {
            balances[recipients[i]] += amount;
        }
    }
}

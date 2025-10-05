// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MembershipNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    uint256 public membershipPrice;
    
    event MembershipMinted(address indexed member, uint256 tokenId);
    event PriceUpdated(uint256 newPrice);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 _membershipPrice,
        address creator
    ) ERC721(name, symbol) Ownable(creator) {
        membershipPrice = _membershipPrice;
    }
    
    function mintMembership() external payable {
        require(msg.value >= membershipPrice, "Insufficient payment");
        
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        
        if (msg.value > membershipPrice) {
            payable(msg.sender).transfer(msg.value - membershipPrice);
        }
        
        emit MembershipMinted(msg.sender, tokenId);
    }
    
    function setMembershipPrice(uint256 _newPrice) external onlyOwner {
        membershipPrice = _newPrice;
        emit PriceUpdated(_newPrice);
    }
    
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function isMember(address account) external view returns (bool) {
        return balanceOf(account) > 0;
    }
}

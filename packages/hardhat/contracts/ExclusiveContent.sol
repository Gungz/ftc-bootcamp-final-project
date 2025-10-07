// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ExclusiveContent is ERC1155, Ownable {
    uint256 private _contentIdCounter;
    
    struct ContentItem {
        uint256 price;
        uint256 maxSupply;
        uint256 currentSupply;
        string uri;
    }
    
    mapping(uint256 => ContentItem) public contentItems;
    
    event ContentCreated(uint256 indexed contentId, uint256 price, uint256 maxSupply, string uri);
    event ContentMinted(uint256 indexed contentId, address indexed minter, uint256 amount);
    
    constructor(address creator) ERC1155("") Ownable(creator) {}
    
    function createContent(
        uint256 price,
        uint256 maxSupply,
        string memory contentUri
    ) external onlyOwner returns (uint256) {
        uint256 contentId = _contentIdCounter++;
        
        contentItems[contentId] = ContentItem({
            price: price,
            maxSupply: maxSupply,
            currentSupply: 0,
            uri: contentUri
        });
        
        emit ContentCreated(contentId, price, maxSupply, contentUri);
        return contentId;
    }
    
    function mintContent(uint256 contentId, uint256 amount) external payable {
        ContentItem storage item = contentItems[contentId];
        require(item.maxSupply > 0, "Content does not exist");
        require(item.currentSupply + amount <= item.maxSupply, "Exceeds max supply");
        require(msg.value >= item.price * amount, "Insufficient payment");
        
        item.currentSupply += amount;
        _mint(msg.sender, contentId, amount, "");
        
        if (msg.value > item.price * amount) {
            payable(msg.sender).transfer(msg.value - (item.price * amount));
        }
        
        emit ContentMinted(contentId, msg.sender, amount);
    }
    
    function uri(uint256 contentId) public view override returns (string memory) {
        return contentItems[contentId].uri;
    }
    
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function getContentCount() external view returns (uint256) {
        return _contentIdCounter;
    }
}

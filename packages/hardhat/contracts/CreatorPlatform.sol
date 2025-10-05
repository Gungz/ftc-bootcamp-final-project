// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./CreatorSpace.sol";

contract CreatorPlatform {
    address[] public allCreatorSpaces;
    mapping(address => address[]) public creatorToSpaces;
    mapping(address => bool) public isCreatorSpace;
    
    event CreatorSpaceCreated(
        address indexed creator,
        address indexed creatorSpace,
        string name,
        uint256 membershipPrice
    );
    
    function createCreatorSpace(
        string memory nftName,
        string memory nftSymbol,
        uint256 membershipPrice
    ) external returns (address) {
        CreatorSpace newSpace = new CreatorSpace(
            msg.sender,
            nftName,
            nftSymbol,
            membershipPrice
        );
        
        address spaceAddress = address(newSpace);
        allCreatorSpaces.push(spaceAddress);
        creatorToSpaces[msg.sender].push(spaceAddress);
        isCreatorSpace[spaceAddress] = true;
        
        emit CreatorSpaceCreated(msg.sender, spaceAddress, nftName, membershipPrice);
        return spaceAddress;
    }
    
    function getCreatorSpaces(address creator) external view returns (address[] memory) {
        return creatorToSpaces[creator];
    }
    
    function getAllCreatorSpaces() external view returns (address[] memory) {
        return allCreatorSpaces;
    }
    
    function getTotalCreatorSpaces() external view returns (uint256) {
        return allCreatorSpaces.length;
    }
}

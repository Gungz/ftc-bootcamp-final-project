// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./MembershipNFT.sol";
import "./ExclusiveContent.sol";
import "./CrowdfundingCampaign.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CreatorSpace is ReentrancyGuard {
    address public creator;
    MembershipNFT public membershipNFT;
    ExclusiveContent public exclusiveContent;
    CrowdfundingCampaign public crowdfunding;
    
    uint256 public totalLikes;
    mapping(address => uint256) public userLikes;
    mapping(address => uint256) public tipReceived;
    
    struct Poll {
        string question;
        string[] options;
        mapping(uint256 => uint256) votes;
        mapping(address => bool) hasVoted;
        uint256 deadline;
        bool active;
    }
    
    uint256 private _pollIdCounter;
    mapping(uint256 => Poll) public polls;
    
    event Tipped(address indexed tipper, uint256 amount, string message);
    event Liked(address indexed liker, uint256 totalLikes);
    event PollCreated(uint256 indexed pollId, string question, uint256 deadline);
    event Voted(uint256 indexed pollId, address indexed voter, uint256 optionIndex);
    
    modifier onlyCreator() {
        require(msg.sender == creator, "Not creator");
        _;
    }
    
    modifier onlyMember() {
        require(membershipNFT.isMember(msg.sender), "Not a member");
        _;
    }
    
    constructor(
        address _creator,
        string memory nftName,
        string memory nftSymbol,
        uint256 membershipPrice
    ) {
        creator = _creator;
        membershipNFT = new MembershipNFT(nftName, nftSymbol, membershipPrice, _creator);
        exclusiveContent = new ExclusiveContent(_creator);
        crowdfunding = new CrowdfundingCampaign(_creator);
    }
    
    function tip(string memory message) external payable onlyMember nonReentrant {
        require(msg.value > 0, "Must send ETH");
        
        tipReceived[msg.sender] += msg.value;
        payable(creator).transfer(msg.value);
        
        emit Tipped(msg.sender, msg.value, message);
    }
    
    function like() external onlyMember {
        userLikes[msg.sender]++;
        totalLikes++;
        
        emit Liked(msg.sender, totalLikes);
    }
    
    function createPoll(
        string memory question,
        string[] memory options,
        uint256 duration
    ) external onlyCreator returns (uint256) {
        require(options.length >= 2, "Need at least 2 options");
        
        uint256 pollId = _pollIdCounter++;
        Poll storage poll = polls[pollId];
        poll.question = question;
        poll.options = options;
        poll.deadline = block.timestamp + duration;
        poll.active = true;
        
        emit PollCreated(pollId, question, block.timestamp + duration);
        return pollId;
    }
    
    function vote(uint256 pollId, uint256 optionIndex) external onlyMember {
        Poll storage poll = polls[pollId];
        require(poll.active, "Poll not active");
        require(block.timestamp < poll.deadline, "Poll ended");
        require(!poll.hasVoted[msg.sender], "Already voted");
        require(optionIndex < poll.options.length, "Invalid option");
        
        poll.votes[optionIndex]++;
        poll.hasVoted[msg.sender] = true;
        
        emit Voted(pollId, msg.sender, optionIndex);
    }
    
    function closePoll(uint256 pollId) external onlyCreator {
        polls[pollId].active = false;
    }
    
    function getPollResults(uint256 pollId) external view returns (uint256[] memory) {
        Poll storage poll = polls[pollId];
        uint256[] memory results = new uint256[](poll.options.length);
        
        for (uint256 i = 0; i < poll.options.length; i++) {
            results[i] = poll.votes[i];
        }
        
        return results;
    }
    
    function getPollOptions(uint256 pollId) external view returns (string[] memory) {
        return polls[pollId].options;
    }
}

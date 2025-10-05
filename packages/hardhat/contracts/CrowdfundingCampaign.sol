// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CrowdfundingCampaign is Ownable, ReentrancyGuard {
    enum CampaignType { ALL_OR_NOTHING, KEEP_WHAT_YOU_RAISE }
    enum CampaignStatus { ACTIVE, SUCCESS, FAILED, WITHDRAWN }
    
    struct Campaign {
        uint256 goal;
        uint256 deadline;
        uint256 raised;
        CampaignType campaignType;
        CampaignStatus status;
    }
    
    uint256 private _campaignIdCounter;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    
    event CampaignCreated(uint256 indexed campaignId, uint256 goal, uint256 deadline, CampaignType campaignType);
    event ContributionMade(uint256 indexed campaignId, address indexed contributor, uint256 amount);
    event CampaignFinalized(uint256 indexed campaignId, CampaignStatus status, uint256 totalRaised);
    event Refunded(uint256 indexed campaignId, address indexed contributor, uint256 amount);
    event FundsWithdrawn(uint256 indexed campaignId, uint256 amount);
    
    constructor(address creator) Ownable(creator) {}
    
    function createCampaign(
        uint256 goal,
        uint256 duration,
        CampaignType campaignType
    ) external onlyOwner returns (uint256) {
        uint256 campaignId = _campaignIdCounter++;
        
        campaigns[campaignId] = Campaign({
            goal: goal,
            deadline: block.timestamp + duration,
            raised: 0,
            campaignType: campaignType,
            status: CampaignStatus.ACTIVE
        });
        
        emit CampaignCreated(campaignId, goal, block.timestamp + duration, campaignType);
        return campaignId;
    }
    
    function contribute(uint256 campaignId) external payable {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.status == CampaignStatus.ACTIVE, "Campaign not active");
        require(block.timestamp < campaign.deadline, "Campaign ended");
        require(msg.value > 0, "Must contribute something");
        
        contributions[campaignId][msg.sender] += msg.value;
        campaign.raised += msg.value;
        
        emit ContributionMade(campaignId, msg.sender, msg.value);
    }
    
    function finalizeCampaign(uint256 campaignId) external {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.status == CampaignStatus.ACTIVE, "Campaign not active");
        require(block.timestamp >= campaign.deadline, "Campaign still ongoing");
        
        if (campaign.raised >= campaign.goal) {
            campaign.status = CampaignStatus.SUCCESS;
        } else {
            campaign.status = campaign.campaignType == CampaignType.ALL_OR_NOTHING 
                ? CampaignStatus.FAILED 
                : CampaignStatus.SUCCESS;
        }
        
        emit CampaignFinalized(campaignId, campaign.status, campaign.raised);
    }
    
    function withdrawFunds(uint256 campaignId) external onlyOwner nonReentrant {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.status == CampaignStatus.SUCCESS, "Campaign not successful");
        
        uint256 amount = campaign.raised;
        campaign.raised = 0;
        campaign.status = CampaignStatus.WITHDRAWN;
        
        payable(owner()).transfer(amount);
        emit FundsWithdrawn(campaignId, amount);
    }
    
    function refund(uint256 campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.status == CampaignStatus.FAILED, "Refunds not available");
        
        uint256 contribution = contributions[campaignId][msg.sender];
        require(contribution > 0, "No contribution to refund");
        
        contributions[campaignId][msg.sender] = 0;
        campaign.raised -= contribution;
        
        payable(msg.sender).transfer(contribution);
        emit Refunded(campaignId, msg.sender, contribution);
    }
}

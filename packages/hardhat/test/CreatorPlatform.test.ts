import { expect } from "chai";
import { ethers } from "hardhat";
import { CreatorPlatform, CreatorSpace, MembershipNFT } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("CreatorPlatform", function () {
  let creatorPlatform: CreatorPlatform;
  let creator: SignerWithAddress;
  let member: SignerWithAddress;
  let membershipPrice: bigint;
  let description: string = "test creator space";

  before(async () => {
    [creator, member] = await ethers.getSigners();
    membershipPrice = ethers.parseEther("0.1");
  });

  describe("Deployment", function () {
    it("Should deploy CreatorPlatform", async function () {
      const CreatorPlatformFactory = await ethers.getContractFactory("CreatorPlatform");
      creatorPlatform = await CreatorPlatformFactory.deploy();
      await creatorPlatform.waitForDeployment();

      expect(await creatorPlatform.getTotalCreatorSpaces()).to.equal(0);
    });
  });

  describe("Creator Space Creation", function () {
    it("Should create a new creator space", async function () {
      const tx = await creatorPlatform.connect(creator).createCreatorSpace(
        "Test Creator Membership",
        "TCM",
        description,
        membershipPrice
      );
      
      await expect(tx).to.emit(creatorPlatform, "CreatorSpaceCreated");
      
      const spaces = await creatorPlatform.getCreatorSpaces(creator.address);
      expect(spaces.length).to.equal(1);
    });

    it("Should track all creator spaces", async function () {
      const total = await creatorPlatform.getTotalCreatorSpaces();
      expect(total).to.equal(1);
    });
  });

  describe("Membership and Tipping", function () {
    let creatorSpace: CreatorSpace;
    let membershipNFT: MembershipNFT;

    it("Should allow membership purchase", async function () {
      const spaces = await creatorPlatform.getCreatorSpaces(creator.address);
      creatorSpace = await ethers.getContractAt("CreatorSpace", spaces[0]);
      
      const nftAddress = await creatorSpace.membershipNFT();
      membershipNFT = await ethers.getContractAt("MembershipNFT", nftAddress);
      
      await membershipNFT.connect(member).mintMembership({ value: membershipPrice });
      
      expect(await membershipNFT.isMember(member.address)).to.be.true;
    });

    it("Should allow members to tip", async function () {
      const tipAmount = ethers.parseEther("0.05");
      
      await expect(
        creatorSpace.connect(member).tip("Great content!", { value: tipAmount })
      ).to.emit(creatorSpace, "Tipped");
    });

    it("Should allow members to like", async function () {
      await expect(creatorSpace.connect(member).like())
        .to.emit(creatorSpace, "Liked");
      
      expect(await creatorSpace.totalLikes()).to.equal(1);
    });
  });

  describe("Polls", function () {
    let creatorSpace: CreatorSpace;

    before(async function () {
      const spaces = await creatorPlatform.getCreatorSpaces(creator.address);
      creatorSpace = await ethers.getContractAt("CreatorSpace", spaces[0]);
    });

    it("Should allow creator to create poll", async function () {
      const question = "What content next?";
      const options = ["Music", "Art", "Writing"];
      const duration = 86400; // 1 day

      await expect(
        creatorSpace.connect(creator).createPoll(question, options, duration)
      ).to.emit(creatorSpace, "PollCreated");
    });

    it("Should allow members to vote", async function () {
      await expect(creatorSpace.connect(member).vote(0, 0))
        .to.emit(creatorSpace, "Voted");
    });

    it("Should prevent double voting", async function () {
      await expect(
        creatorSpace.connect(member).vote(0, 1)
      ).to.be.revertedWith("Already voted");
    });
  });
});

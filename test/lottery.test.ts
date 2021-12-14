import { ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Lottery, Lottery__factory } from "../typechain-types";

chai.use(chaiAsPromised);
const { expect } = chai;

describe("Greeter Contract", () => {
  let lottery: Lottery;
  let ownerOfContract = "";

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    const lotteryFactory = (await ethers.getContractFactory(
      "Lottery",
      signers[0]
    )) as Lottery__factory;

    lottery = await lotteryFactory.deploy();

    ownerOfContract = await lottery.owner();
  });

  it("should check owner of contract", async () => {
    expect(await lottery.owner()).to.equal(ownerOfContract);
  });

  it("should send ether to contract", async () => {
    const etherAmount = "0.1";
    const tx = {
      to: lottery.address,
      value: ethers.utils.parseEther(etherAmount),
    };

    await lottery.signer.sendTransaction(tx);
    expect(ethers.utils.formatEther(await lottery.getBalance())).to.eq(
      etherAmount
    );
  });

  it("should send different amount of ether and fail ", async () => {
    const etherAmount = "0.9";
    const tx = {
      to: lottery.address,
      value: ethers.utils.parseEther(etherAmount),
    };

    await expect(lottery.signer.sendTransaction(tx)).to.be.revertedWith(
      "Minimum entrance fee is 0.1 ethers!"
    );
  });

  it("should try to access balance and fails", async () => {
    const signers = await ethers.getSigners();

    await expect(lottery.connect(signers[1]).getBalance()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("should return initial player count as 0", async () => {
    expect(await lottery.playersCount()).to.eq("0");
  });

  it("should return players count as 1 after tx", async () => {
    const etherAmount = "0.1";
    const tx = {
      to: lottery.address,
      value: ethers.utils.parseEther(etherAmount),
    };
    await lottery.signer.sendTransaction(tx);
    expect(await lottery.playersCount()).to.eq(1);
  });

  it("should return 0.5 ether after transactions", async () => {
    const signers = await ethers.getSigners();

    const etherAmount = "0.1";
    const tx = {
      to: lottery.address,
      value: ethers.utils.parseEther(etherAmount),
    };

    await lottery.signer.sendTransaction(tx);
    await lottery.connect(signers[2]).signer.sendTransaction(tx);
    await lottery.connect(signers[3]).signer.sendTransaction(tx);
    await lottery.connect(signers[4]).signer.sendTransaction(tx);
    await lottery.connect(signers[5]).signer.sendTransaction(tx);

    expect(ethers.utils.formatEther(await lottery.getBalance())).to.eq("0.5");
  });

  it("should return 0.0 ether after winner picked", async () => {
    const signers = await ethers.getSigners();

    const etherAmount = "0.1";
    const tx = {
      to: lottery.address,
      value: ethers.utils.parseEther(etherAmount),
    };

    await lottery.signer.sendTransaction(tx);
    await lottery.connect(signers[1]).signer.sendTransaction(tx);
    await lottery.connect(signers[2]).signer.sendTransaction(tx);
    await lottery.connect(signers[3]).signer.sendTransaction(tx);
    await lottery.connect(signers[4]).signer.sendTransaction(tx);

    await lottery.pickWinner();

    expect(ethers.utils.formatEther(await lottery.getBalance())).to.eq("0.0");
  });
});

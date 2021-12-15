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
    const signers = await ethers.getSigners();

    const etherAmount = "1";
    const tx = {
      to: lottery.address,
      value: ethers.utils.parseEther(etherAmount),
    };

    await lottery.connect(signers[1]).signer.sendTransaction(tx);
    expect(ethers.utils.formatEther(await lottery.getBalance())).to.eq("1.0");
  });

  it("should send different amount of ether and fail ", async () => {
    const etherAmount = "0.9";
    const tx = {
      to: lottery.address,
      value: ethers.utils.parseEther(etherAmount),
    };

    await expect(lottery.signer.sendTransaction(tx)).to.be.revertedWith(
      "Minimum entrance fee is 1 ethers!"
    );
  });

  it("should try to access balance and fails", async () => {
    const signers = await ethers.getSigners();

    await expect(lottery.connect(signers[1]).getBalance()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("should return initial player count as 1 because owner automatically added up", async () => {
    expect(await lottery.playersCount()).to.eq(1);
  });

  it("should return players count as 2 after tx", async () => {
    const signers = await ethers.getSigners();

    const etherAmount = "1";
    const tx = {
      to: lottery.address,
      value: ethers.utils.parseEther(etherAmount),
    };
    await lottery.connect(signers[1]).signer.sendTransaction(tx);
    expect(await lottery.playersCount()).to.eq(2);
  });

  it("should return 0.5 ether after transactions", async () => {
    const signers = await ethers.getSigners();

    const etherAmount = "1";
    const tx = {
      to: lottery.address,
      value: ethers.utils.parseEther(etherAmount),
    };

    for (const signer of signers.slice(1, 6)) {
      await lottery.connect(signer).signer.sendTransaction(tx);
    }

    expect(ethers.utils.formatEther(await lottery.getBalance())).to.eq("5.0");
  });

  it("should return 0.0 ether after winner picked", async () => {
    const signers = await ethers.getSigners();

    const etherAmount = "1";
    const tx = {
      to: lottery.address,
      value: ethers.utils.parseEther(etherAmount),
    };

    for (const signer of signers.slice(1, 6)) {
      await lottery.connect(signer).signer.sendTransaction(tx);
    }

    await lottery.connect(signers[0]).pickWinner();

    expect(ethers.utils.formatEther(await lottery.getBalance())).to.eq("0.0");
  });

  it("should prevent owner to participate", async () => {
    const etherAmount = "1";
    const tx = {
      to: lottery.address,
      value: ethers.utils.parseEther(etherAmount),
    };

    await expect(lottery.signer.sendTransaction(tx)).to.revertedWith(
      "Owner cannot participate!"
    );
  });

  it("should add owner as the first participant on contract creation", async () => {
    const signers = await ethers.getSigners();
    expect(await lottery.players(0)).to.equal(signers[0].address);
  });

  it("should be reverted if players count less than 10 and sender not the owner", async () => {
    const signers = await ethers.getSigners();

    const etherAmount = "1";
    const tx = {
      to: lottery.address,
      value: ethers.utils.parseEther(etherAmount),
    };

    signers
      .slice(1, 11)
      .forEach(
        async (signer) =>
          await lottery.connect(signer).signer.sendTransaction(tx)
      );

    await expect(lottery.connect(signers[1]).pickWinner()).to.revertedWith(
      "You are not the Owner!"
    );
  });

  it("should return 1 ether after winner is picked", async () => {
    const signers = await ethers.getSigners();
    const ownersBalanceBeforeTx = ethers.utils.formatEther(
      await signers[0].getBalance()
    );
    const etherAmount = "1";
    const tx = {
      to: lottery.address,
      value: ethers.utils.parseEther(etherAmount),
    };

    for (const signer of signers.slice(1, 11)) {
      await lottery.connect(signer).signer.sendTransaction(tx);
    }

    await lottery.connect(signers[0]).pickWinner();

    expect(
      Number(ethers.utils.formatEther(await signers[0].getBalance()))
    ).to.greaterThan(Number(ownersBalanceBeforeTx));
  });
});

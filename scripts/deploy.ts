import { ethers } from "hardhat";
import { Lottery } from "../typechain-types";
//CONTRACT ADDRESS 0x3aeE91891A66D4E952ae4eAc110Ff51A000ce14f
async function main() {
  const Lottery = await ethers.getContractFactory("Lottery");

  let contract = (await Lottery.deploy()) as Lottery;

  console.log(
    `The address the Contract WILL have once mined: ${contract.address}`
  );

  console.log(
    `The transaction that was sent to the network to deploy the Contract: ${contract.deployTransaction.hash}`
  );

  console.log(
    "The contract is NOT deployed yet; we must wait until it is mined..."
  );
  await contract.deployed();
  console.log("Mined!");

  console.log(
    "Current balance of contract",
    await contract.functions.getBalance()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

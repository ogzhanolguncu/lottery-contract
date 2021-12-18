import { HardhatUserConfig } from "hardhat/types";

import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage";
import "hardhat-watcher";

import "@typechain/hardhat";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [{ version: "0.8.4", settings: {} }],
  },
  networks: {
    hardhat: {},
    localhost: {},
    ropsten: {
      url: process.env.INFURA_KEY,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
  etherscan: {
    apiKey: "",
  },
  watcher: {
    test: {
      tasks: ["test"],
      files: ["./test"],
      verbose: true,
    },
    compile: {
      tasks: ["compile"],
    },
  },
};

export default config;

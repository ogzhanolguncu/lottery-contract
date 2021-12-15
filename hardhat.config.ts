import { HardhatUserConfig } from "hardhat/types";

import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "solidity-coverage";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-watcher";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [{ version: "0.8.4", settings: {} }],
  },
  // networks: {
  //   hardhat: {},
  //   localhost: {},
  //   ropsten: {
  //     url: "",
  //     accounts: [""],
  //   },
  // },
  // etherscan: {
  //   apiKey: "",
  // },
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

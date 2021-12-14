//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lottery is Ownable {
	uint256 public constant MIN_DEPOSIT = 0.1 ether;

	address payable[] public players;

	receive() external payable {
		require(
			msg.value == MIN_DEPOSIT,
			"Minimum entrance fee is 0.1 ethers!"
		);
		players.push(payable(msg.sender));
	}

	function getBalance() public view onlyOwner returns (uint256) {
		return address(this).balance;
	}

	function playersCount() public view returns (uint256) {
		return players.length;
	}

	function random() public view returns (uint256) {
		return
			uint256(
				keccak256(
					abi.encodePacked(
						block.difficulty,
						block.timestamp,
						players.length
					)
				)
			);
	}

	function pickWinner() public onlyOwner returns (address player) {
		require(players.length >= 3);

		uint256 r = random();
		address payable winner;

		uint256 index = r % players.length;
		winner = players[index];

		winner.transfer(getBalance());

		return winner;
	}
}

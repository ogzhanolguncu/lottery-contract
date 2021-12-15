//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Lottery is Ownable {
	using SafeMath for uint256;

	uint256 public constant MIN_DEPOSIT = 1 ether;

	address payable[] public players;

	constructor() {
		players.push(payable(msg.sender));
	}

	receive() external payable {
		require(msg.value == MIN_DEPOSIT, "Minimum entrance fee is 1 ethers!");
		require(msg.sender != owner(), "Owner cannot participate!");
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

	function pickWinner() public minimumTenPlayers returns (address player) {
		require(players.length >= 3);

		uint256 r = random();
		address payable winner;
		uint256 tenPercentCut = getBalance().div(10);
		uint256 index = r % players.length;

		winner = players[index];
		payable(owner()).transfer(tenPercentCut);
		winner.transfer(getBalance());

		return winner;
	}

	modifier minimumTenPlayers() {
		if (playersCount() < 10) {
			require(msg.sender == owner(), "You are not the Owner!");
		}
		_;
	}
}

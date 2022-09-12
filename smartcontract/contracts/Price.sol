// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";



 import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract PriceConsumerV3 is Ownable  {
  AggregatorV3Interface public priceFeed;

  constructor()  {
    priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
  }

    function getLatestPrice() public view returns (int) {
      (,int price,,,) = priceFeed.latestRoundData();

      return price;
    }

  // Start here
  function getDecimals() public view returns(uint8) {
    uint8 decimals = priceFeed.decimals();

    return decimals;
  }

     
      function withdraw() public onlyOwner  {
          address _owner = owner();
          uint256 amount = address(this).balance;
          (bool sent, ) =  _owner.call{value: amount}("");
          require(sent, "Failed to send Ether");
      }

       // Function to receive Ether. msg.data must be empty
      receive() external payable {}

      // Fallback function is called when msg.data is not empty
      fallback() external payable {}



}

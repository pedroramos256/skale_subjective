const hre = require("hardhat");

async function main() {


  const Subjective = await hre.ethers.getContractFactory("Subjective");
  const subjective = await Subjective.deploy();

  await subjective.deployed();

  console.log("Subjective.sol deployed to:", subjective.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

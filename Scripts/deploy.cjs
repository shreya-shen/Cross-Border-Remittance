// scripts/deploy.cjs
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Step 1: Deploy Mock Stablecoin
  const MockToken = await ethers.getContractFactory("MockToken");
  const stablecoin = await MockToken.deploy("Mock USD", "mUSD");
  await stablecoin.deployed();
  console.log("✅ Mock Stablecoin deployed at:", stablecoin.address);

  // Step 2: Deploy Remittance contract using the mock token
  const Remittance = await ethers.getContractFactory("Remittance");
  const remittance = await Remittance.deploy(stablecoin.address);
  await remittance.deployed();
  console.log("✅ Remittance contract deployed at:", remittance.address);
}

main().catch((error) => {
  console.error("❌ Deployment error:", error);
  process.exit(1);
});
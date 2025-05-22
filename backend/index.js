import mongoose from 'mongoose';
const mongoURI = "mongodb+srv://vaishnavi03:cbr%26ep%40Mongo@cluster0.drzujf3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected ✅ ");
});


import express from 'express';
import bodyParser from 'body-parser';
import { JsonRpcProvider, Contract, Wallet } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

//mongo schema bruh
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  role: String,
  kycStatus: String,  // should be 'pending', 'verified', etc.
  createdAt: Date,
  updatedAt: Date
});
const User = mongoose.model('User', userSchema);

// file sys
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resultsFile = path.join(__dirname, 'transaction_log.json');

// ABIs
import remittanceAbi from './abi/Remittance.json' assert { type: "json" };
import stablecoinAbi from './abi/MockToken.json' assert { type: "json" };

// ether setup (rep with your real contract addrs)
const provider = new JsonRpcProvider('http://localhost:8545');
const remittanceAddress = '0x000000000000000000000000000000000000beef';
const stablecoinAddress = '0x000000000000000000000000000000000000dead';

// logging function 
const logResult = (success, sender, recipient, amount, stage, message) => {
  const logEntry = { timestamp: new Date().toISOString(), sender, recipient, amount, stage, success, message };

  let logData = [];
  if (fs.existsSync(resultsFile)) {
    logData = JSON.parse(fs.readFileSync(resultsFile));
  }

  logData.push(logEntry);
  fs.writeFileSync(resultsFile, JSON.stringify(logData, null, 2));
};

// mock KYC check
const mockKYCAPI = async (identifier) => {
  // 'identifier' is email for now, replace with wallet address later if needed
  const user = await User.findOne({ email: identifier.toLowerCase() });

  if (!user) {
    return { verified: false, reason: "User not found" };
  }

  if (user.kycStatus !== "verified") {
    return { verified: false, reason: `KYC not verified (${user.kycStatus})` };
  }

  return { verified: true };
};

// mock AML risk scoring
const mockAMLCheck = async (address, amount, recipient) => {
  let riskScore = 0;
  let reasons = [];

  // deny if person is too rich
  if (amount > 1000000) {
    riskScore += 40;
    reasons.push("High amount");
  } else if (amount > 500000) {
    riskScore += 20;
    reasons.push("Medium amount");
  }

  // sus recipient addrs
  /* if (recipient.endsWith("bad")) {
    riskScore += 25;
    reasons.push("Flagged recipient address");
  } */

  // odd time
  const hour = new Date().getUTCHours();
  if (hour < 6 || hour > 22) {
    riskScore += 15;
    reasons.push("Unusual transaction hour");
  }

  // flagged accs
  if (["0x111...", "0xdeadbeef...", address].includes(address)) {
    riskScore += 20;
    reasons.push("Flagged sender address");
  }

  const THRESHOLD = 70;

  if (riskScore >= THRESHOLD) {
    return {
      compliant: false,
      reason: `Risk score too high (${riskScore}): ${reasons.join(", ")}`
    };
  }

  return {
    compliant: true,
    reason: `Risk score acceptable (${riskScore})`
  };
};

// xpress setup
const app = express();
app.use(bodyParser.json());

// POST /send route — trans entry point
app.post('/send', async (req, res) => {
  const { senderPrivateKey, recipient, amount, fxRate, sourceCurrency, targetCurrency } = req.body;

  try {
    const wallet = new Wallet(senderPrivateKey, provider);
    const sender = wallet.address;

    // 🔒 KYC Check
    const kyc = await mockKYCAPI(sender);
    if (!kyc.verified) {
      logResult(false, sender, recipient, amount, 'KYC', kyc.reason);
      return res.status(403).json({ message: 'Transaction blocked due to KYC failure', reason: kyc.reason });
    }
    logResult(true, sender, recipient, amount, 'KYC', 'KYC verified');
    console.log(`✅ KYC verified for ${sender}`);

    // 🚨 AML Check
    const aml = await mockAMLCheck(sender, amount, recipient);  // ✅ Fixed: recipient is now passed
    if (!aml.compliant) {
      logResult(false, sender, recipient, amount, 'AML', aml.reason);
      return res.status(403).json({ message: 'Transaction blocked due to AML non-compliance', reason: aml.reason });
    }
    logResult(true, sender, recipient, amount, 'AML', aml.reason);
    console.log(`✅ AML compliance verified for ${sender}`);

    // 💸 Contract interactions
    const stablecoin = new Contract(stablecoinAddress, stablecoinAbi, wallet);
    const remittance = new Contract(remittanceAddress, remittanceAbi, wallet);

    const approveTx = await stablecoin.approve(remittanceAddress, amount);
    await approveTx.wait();

    const tx = await remittance.sendRemittance(recipient, amount, fxRate, sourceCurrency, targetCurrency);
    await tx.wait();

    logResult(true, sender, recipient, amount, 'Success', 'Transaction completed');
    return res.json({
      message: 'Transaction successful',
      txHash: tx.hash,
      kyc: 'KYC verified',
      aml: aml.reason
    });

  } catch (err) {
    console.error('Transaction failed:', err);
    logResult(false, 'unknown', recipient, amount, 'Error', err.message);
    return res.status(500).json({ message: 'Transaction failed', error: err.message });
  }
});

// start server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
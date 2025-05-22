import express from 'express';
import bodyParser from 'body-parser';
import { JsonRpcProvider, Contract, Wallet } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// dir and log file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resultsFile = path.join(__dirname, 'transaction_log.json');

//ABIs
import remittanceAbi from './abi/Remittance.json' assert { type: "json" };
import stablecoinAbi from './abi/MockToken.json' assert { type: "json" };

// ether provider and contract addr (replace with actual values or use .env)
const provider = new JsonRpcProvider('http://localhost:8545');
const remittanceAddress = '0x000000000000000000000000000000000000beef';
const stablecoinAddress = '0x000000000000000000000000000000000000dead';

// log transactions
const logResult = (success, sender, recipient, amount, stage, message) => {
  const logEntry = {
    timestamp: new Date().toISOString(), sender, recipient, amount, stage, success, message };

  let logData = [];
  if (fs.existsSync(resultsFile)) {
    logData = JSON.parse(fs.readFileSync(resultsFile));
  }

  logData.push(logEntry);
  fs.writeFileSync(resultsFile, JSON.stringify(logData, null, 2));
};

// mock KYC Cvheck
const mockKYCAPI = async (address) => {
  // simply: deny if address ends with '5'
  if (address.endsWith('5')) {
    return { verified: false, reason: 'KYC pending' };
  }
  return { verified: true };
};

// mock AML check
const mockAMLCheck = async (address, amount) => {
  // deny if sender is too rich
  if (amount > 1000000) {
    return { compliant: false, reason: 'AML threshold exceeded' };
  }
  return { compliant: true };
};

// init Exp
const app = express();
app.use(bodyParser.json());

//POS
app.post('/send', async (req, res) => {
  const { senderPrivateKey, recipient, amount, fxRate, sourceCurrency, targetCurrency } = req.body;

  try {
    const wallet = new Wallet(senderPrivateKey, provider);
    const sender = wallet.address;

    //KYC
    const kyc = await mockKYCAPI(sender);
    if (!kyc.verified) {
      logResult(false, sender, recipient, amount, 'KYC', kyc.reason);
      return res.status(403).json({ message: 'Transaction blocked due to KYC failure', reason: kyc.reason });
    }

    //AML
    const aml = await mockAMLCheck(sender, amount);
    if (!aml.compliant) {
      logResult(false, sender, recipient, amount, 'AML', aml.reason);
      return res.status(403).json({ message: 'Transaction blocked due to AML non-compliance', reason: aml.reason });
    }

    // interact with contracts
    const stablecoin = new Contract(stablecoinAddress, stablecoinAbi, wallet);
    const remittance = new Contract(remittanceAddress, remittanceAbi, wallet);

    //tokens
    const approveTx = await stablecoin.approve(remittanceAddress, amount);
    await approveTx.wait();

    //SEND BABYYY
    const tx = await remittance.sendRemittance(recipient, amount, fxRate, sourceCurrency, targetCurrency);
    await tx.wait();

    logResult(true, sender, recipient, amount, 'Success', 'Transaction completed');
    return res.json({ message: 'Transaction successful', txHash: tx.hash });
  } catch (err) {
    console.error('Transaction failed:', err);
    logResult(false, 'unknown', recipient, amount, 'Error', err.message);
    return res.status(500).json({ message: 'Transaction failed', error: err.message });
  }
});

// start
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
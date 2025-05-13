import Web3 from 'web3';

const web3 = new Web3(window.ethereum);
await window.ethereum.request({ method: 'eth_requestAccounts' });
const accounts = await web3.eth.getAccounts();
console.log("Connected account:", accounts[0]);
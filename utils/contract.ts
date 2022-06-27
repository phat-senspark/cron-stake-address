import Web3 from "web3"
import { AbiItem } from "web3-utils";
import { stakeBcoinABI } from "./abi/stakeBcoinABI";
import "dotenv/config"
import { Contract } from "web3-eth-contract";

export const web3 = new Web3(`${process.env.PROVIDER_URL}`)

export const stakeBcoinContract = (address: string, rpc: string): Contract => {
  console.log("rpc: ", rpc);
  const web3 = new Web3(`${rpc}`)
  return new web3.eth.Contract(stakeBcoinABI as AbiItem[], address);
};

export const stakeSenContract = (address: string, rpc: string): Contract => {
  const web3 = new Web3(`${rpc}`)
  return new web3.eth.Contract(stakeBcoinABI as AbiItem[], address);
}

export const contracts = {
  "StakeBcoin": stakeSenContract,
  "StakeSen": stakeSenContract
}

export const contractAddress = {
  "bsc-mainnet": {
    "StakeBcoin": "0x1CF220128D22B9c272260c6B9Ff84Eed77Dba6F1",
    "StakeSen": ""
  },
  "bsc-testnet": {
    "StakeBcoin": "",
    "StakeSen": ""
  },
  "polygon": {
    "StakeBcoin": "",
    "StakeSen": ""
  },
  "mumbai": {
    "StakeBcoin": "",
    "StakeSen": ""
  }
}

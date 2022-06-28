import { Contract } from 'ethers';
import fs from 'fs';
import path from 'path';
import { networks } from './utils/config';
import { contractAddress, contracts } from './utils/contract';

const dir = path.join(__dirname, "./datas/");

export const getClaimer = async (nthFile: number, contractName: string, network: string) => {
  console.log("here");
  const address: string = contractAddress[network][contractName];
  const listNetwork: Array<string> = networks[network];
  const contract = contracts[contractName];
  const re = /[0-9A-Fa-f]{6}/g;
  let data: string[];
  try {
    data = fs.readFileSync(dir + nthFile.toString() + '_data.csv', "utf8").split(",\n");

  } catch (error) {
    console.log("data: ", dir + nthFile.toString() + '_data.csv');
    console.log("File not existed");
    process.exit(1);
  }

  const listUser = data.filter((x) => re.test(x));

  //TODO: Get stakers from contract
  const stakers = await contract(address, listNetwork[0]).methods.getClaimer(listUser, 0);
}

// getClaimer(5, "stakeBcoin", "bsc-mainnet");

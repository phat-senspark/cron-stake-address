import Web3 from "web3"
import { AbiItem } from "web3-utils";
import { stakeBcoinABI } from "./abi/stakeBcoinABI";
import "dotenv/config"

export const web3 = new Web3(`${process.env.PROVIDER_URL}`)
export const stakeBcoinContract = new web3.eth.Contract(stakeBcoinABI as  AbiItem[],`${process.env.STAKE_BCOIN_ADDRESS}`);
import { ethers } from "ethers";
import { EventData } from "web3-eth-contract";
import { networks } from "./utils/config";
import { contractAddress, contracts, web3 } from "./utils/contract";

export const getPastEvent = async (nameEvent: string, contractName: string, fromBlock: number, toBlock: number, network: string) => {
  const address: string = contractAddress[network][contractName];
  const listNetwork: Array<string> = networks[network];
  const contract = contracts[contractName];

  const latestBlockNetwork = await web3.eth.getBlockNumber();
  const block =
    ((toBlock === undefined) || ((toBlock as number) >= latestBlockNetwork))
      ? latestBlockNetwork
      : (toBlock as number);

  if (block - fromBlock > 144000) return { result: [], block };

  let listUserStake: Array<object> = [];
  if (fromBlock + 5000 > block) {
    let rpcIdx = 0;
    let stakeEvents: EventData[];

    // Switch rpc
    while (true) {
      try {
        stakeEvents = await contract(address, listNetwork[rpcIdx])
          .getPastEvents(nameEvent, {
            fromBlock: fromBlock,
            toBlock: block,
          });
        break;

      } catch (error) {
        console.log("error: ", error);
        if (rpcIdx === listNetwork.length - 1) rpcIdx = -1;
        ++rpcIdx;
      }
    }
    listUserStake = listUserStake.concat(filterParamsEvent(['user'], stakeEvents));

  } else {
    let fromBlockTemp = fromBlock;
    let currentBlock = fromBlockTemp + 5000;

    while (true) {
      let rpcIdx = 0;
      let stakeEvents: EventData[];
      //swithc rpc
      while (true) {
        try {
          // Get events
          stakeEvents = await contract(address, listNetwork[rpcIdx])
            .getPastEvents(nameEvent, {
              fromBlock: fromBlockTemp,
              toBlock: currentBlock,
            });
          break;
        } catch (error) {
          console.log("error: ", error);
          if (rpcIdx === listNetwork.length - 1) rpcIdx = -1;
          ++rpcIdx;
        }
      }
      // Append data after each get
      listUserStake = listUserStake.concat(filterParamsEvent(['user'], stakeEvents));

      if (currentBlock >= block) break;
      fromBlockTemp = currentBlock;
      currentBlock += 5000;
    }
  }

  const listUserTemp = listUserStake.map((v) => v['user'])
  const result = listUserTemp.filter((x, i) => i === listUserTemp.indexOf(x));
  return { result, block };

}

const filterParamsEvent = (params: Array<string>, events: EventData[]) => {
  let result: Array<object> = [];
  for (let i = 0; i < events.length; ++i) {
    const returnValue = events[i].returnValues;
    let value: object = {};
    for (let j = 0; j < params.length; ++j) {
      value[`${params[j]}`] =
        params[j] == 'amount'
          ? Number(ethers.utils.formatEther(returnValue[`${params[j]}`]))
          : returnValue[`${params[j]}`];
    }
    result.push(value);
  }
  return result;
}

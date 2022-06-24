import { ethers } from "ethers";
import { EventData } from "web3-eth-contract";
import { stakeBcoinContract, web3 } from "./utils/contract";

export const getPastEvent = async (nameEvent: string, fromBlock: number, toBlock: number | string) => {
  const latestBlockNetwork = await web3.eth.getBlockNumber();
  const block =
    ((toBlock as string) === 'latest' || (toBlock === undefined) || ((toBlock as number) >= latestBlockNetwork))
      ? latestBlockNetwork
      : (toBlock as number);
  if (block - fromBlock > 144000) return [];

  let listUserStake: Array<object> = [];
  if (fromBlock + 5000 > block) {
    const stakeEvents = await stakeBcoinContract
      .getPastEvents(nameEvent, {
        fromBlock: fromBlock,
        toBlock: 'latest',
      });

    listUserStake = listUserStake.concat(filterParamsEvent(['user'], stakeEvents),
    );
  } else {
    let fromBlockTemp = fromBlock;
    let currentBlock = fromBlockTemp + 5000;
    while (true) {
      let stakeEvents = await stakeBcoinContract
        .getPastEvents(nameEvent, {
          fromBlock: fromBlockTemp,
          toBlock: currentBlock,
        });

      listUserStake = listUserStake.concat(filterParamsEvent(['user'], stakeEvents),
      );

      if (currentBlock >= block) break;
      fromBlockTemp = currentBlock;
      currentBlock += 5000;
    }
  }

  const listUserTemp = listUserStake.map((v) => v['user'])
  const result = listUserTemp.filter((x, i) => i === listUserTemp.indexOf(x));
  return result;
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

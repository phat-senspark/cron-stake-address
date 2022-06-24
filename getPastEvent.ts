import { ethers } from "ethers";
import { EventData } from "web3-eth-contract";
import { stakeBcoinContract, web3 } from "./utils/contract";

export const getPastEvent = async (nameEvent: string, fromBlock: number, toBlock: number|string) =>{
    const latestBlockNetwork = await web3.eth.getBlockNumber();
    const block =
      ((toBlock as string) === 'latest' || (toBlock === undefined) || ((toBlock as number) >= latestBlockNetwork))
        ? latestBlockNetwork
        : (toBlock as number);
    if ( block - fromBlock > 144000 ) return [];

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
    // return removeDuplicateUser([
    //     '0x6aDCF859cCeAD8DDBd17d5B1C3653AD31512762a',
    //     '0x6aDCF859cCeAD8DDBd17d5B1C3653AD31512762a',
    //     '0x3aDf52873Ca4fB34D2A9AB16a529520C7787740b',
    //     '0x6aDCF859cCeAD8DDBd17d5B1C3653AD31512762a',
    //     '0x6aDCF859cCeAD8DDBd17d5B1C3653AD31512762a',
    //     '0x6aDCF859cCeAD8DDBd17d5B1C3653AD31512762a',
    // ]);
    return removeDuplicateUser(listUserStake.map((v) => v['user']));
}

const filterParamsEvent = (params: Array<string>, events: EventData[]) =>{
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

export const removeDuplicateUser  = (listUser: Array<string>)=>{
    let result = []
    let lenght = 0;
    let hashTable = {}
    for (let i = 0; i < listUser.length; ++i) {
        const hash = ethers.utils.keccak256(listUser[i])
        if(!hashTable.hasOwnProperty(hash)){
            hashTable[hash] = lenght;
            ++lenght;
            result.push(listUser[i])
        }else{
            result[hashTable[hash]] = listUser[i];
        }
    }
    return result;
}
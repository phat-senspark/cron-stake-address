
import { convertArrayToCSV } from 'convert-array-to-csv';
import { getPastEvent, removeDuplicateUser } from './getPastEvent';
const sleep = (s:number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, s*1000);
    });
  }
export const crawlStake = async (data: Array<string>,eventName: string, fromBlock: number, toBlock: number|string)=>{
   if (fromBlock >= toBlock){
    console.log("data: ", removeDuplicateUser(data));
    const csvData = convertArrayToCSV(data);
    console.log("csvData: ", csvData);
    process.exit(1);
   } 
   await sleep(180);
   console.log("here")
   const userData = await getPastEvent(eventName, fromBlock, fromBlock + 28800);
   data.concat(userData);
   crawlStake(data,eventName,fromBlock + 28800, toBlock);
}
crawlStake([],"Stake",18672496,'latest').then();

import { getPastEvent } from './getPastEvent';
import path from 'path';
import fs from 'fs';
const minSleep = Number(process.env.MIN_SLEEP) * 60;
const blockDays = Number(process.env.DAY) * 28800;
const sleep = (s: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, s * 1000);
  });
}
export const crawlStake = async (data: Array<string>, eventName: string, contractName: string, fromBlock: number, toBlock: number, network: string, crawledBlock: number) => {

  if (fromBlock >= toBlock) {
    const dir = path.join(__dirname, "./datas");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // Count files
    let numFile = fs.readdirSync(dir).length;
    // write data to files
    data.push(crawledBlock.toString())
    const writeStream = fs.createWriteStream(path.join(dir, numFile.toString() + "_data.csv"));
    writeStream.write(data.join(',\n'), (err) => {
      if (err) console.log("error: ", err);
      writeStream.close();
      process.exit(1);
    });

  }

  await sleep(minSleep);
  const { result, block } = await getPastEvent(eventName, contractName, fromBlock, fromBlock + blockDays, network);
  const dataTemp = data.concat(...result);
  data = dataTemp.filter((x, i) => i === dataTemp.indexOf(x));

  console.log("Has crawled");
  crawlStake(data, eventName, contractName, fromBlock + blockDays, toBlock, network, block);
}
// crawlStake([], "Stake", "stakeBcoin", 19039957, 19049115, 'bsc-mainnet', 19039957).then(); // fromBlock == crawledBlock

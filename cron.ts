
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
export const crawlStake = async (data: Array<string>, eventName: string, fromBlock: number, toBlock: number | string) => {
  if (fromBlock >= toBlock) {
    if (!fs.existsSync(path.join(__dirname, "./datas"))) {
      fs.mkdirSync(path.join(__dirname, "./datas"));
    }

    const writeStream = fs.createWriteStream(path.join(__dirname, "./datas/", (new Date()).valueOf().toString() + "_data.csv"));
    writeStream.write(data.join(',\n'), (err) => {
      if (err) console.log("error: ", err);
      writeStream.close();
      process.exit(1);
    });

  }

  await sleep(minSleep);
  console.log("Has crawled");

  const userData = await getPastEvent(eventName, fromBlock, fromBlock + blockDays);
  const dataTemp = data.concat(...userData);
  data = dataTemp.filter((x, i) => i === dataTemp.indexOf(x));

  crawlStake(data, eventName, fromBlock + blockDays, toBlock);
}
crawlStake([], "Stake", 18672496, 18700000).then();

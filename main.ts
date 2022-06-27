import { crawlStake } from "./crawl"
import yargs from "yargs"
import { getClaimer } from "./getClaimers"
import { hideBin } from "yargs/helpers";
import { getPastEvent } from "./getPastEvent";
interface ArgvsCrawls {
  contract: string,
  event: string,
  fromBlock: number,
  toBlock: number,
  network: string
}
interface ArgvClaimers {
  nthFile: number,
  contract: string,
  network: string
}
const main = () => {
  // List command helps
  yargs(hideBin(process.argv))
    .command('crawl [contract] [event] [fromBlock] [toBlock] [network]', 'start the server', (yargs) => {
      console.log("here: ")
      return yargs
        .option({
          contract: {
            type: "string",
            describe: 'Name contract',
            alias: 'c'
          },
          event: {
            type: "string",
            describe: 'Name event',
            alias: 'e'
          },
          fromBlock: {
            type: "number",
            describe: 'From block',
            alias: 'f'
          },
          toBlock: {
            type: "number",
            describe: 'To block',
            alias: 't'
          },
          network: {
            type: "string",
            describe: "Chain network",
            alias: 'n',
          }
        })
    }, (argv) => {
      if (!((argv.contract !== undefined) && (argv.event !== undefined) && (argv.fromBlock !== undefined) && (argv.toBlock !== undefined) && (argv.network !== undefined))) {
        console.log("Unless argvs, using --help for more details ");
        return;
      }
      getPastEvent(argv.event, argv.contract, argv.fromBlock, argv.toBlock, argv.network)
    }).command('claimer [nthFile] [contract] [network]', 'Get claimers', (yargs) => {
      return yargs
        .option({
          nthFile: {
            type: "number",
            describe: 'nth of file',
            alias: 'nth'
          }
        })
    }, (argv) => {
      if (!((argv.nthFile !== undefined) && (argv.contract !== undefined) && (argv.network !== undefined))) {
        console.log("Unless argvs, using --help for more details ");
        return;
      }
      getClaimer(argv.nthFile, argv.contract, argv.network);
    }).option({
      contract: {
        type: "string",
        describe: 'Name contract',
        alias: 'c'
      },
      event: {
        type: "string",
        describe: 'Name event',
        alias: 'e'
      },
      fromBlock: {
        type: "number",
        describe: 'From block',
        alias: 'f'
      },
      toBlock: {
        type: "number",
        describe: 'To block',
        alias: 't'
      },
      network: {
        type: "string",
        describe: "Chain network",
        alias: 'n',
      },
      nthFile: {
        type: "number",
        describe: 'nth of file',
        alias: 'nth'
      },
    })
    .help().parse();

}
main()

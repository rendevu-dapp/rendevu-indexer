// imports
import { assertNotNull } from "@subsquid/util-internal";
import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
} from "@subsquid/evm-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";

// abis
import * as eventPlatformAbi from "./abi/event-platform";

export const db = new TypeormDatabase({ supportHotBlocks: true });
export const processor = new EvmBatchProcessor()
  // Lookup archive by the network name in Subsquid registry
  // See https://docs.subsquid.io/evm-indexing/supported-networks/
  .setGateway("https://v2.archive.subsquid.io/network/base-mainnet ")
  // Chain RPC endpoint is required for
  //  - indexing unfinalized blocks https://docs.subsquid.io/basics/unfinalized-blocks/
  //  - querying the contract state https://docs.subsquid.io/evm-indexing/query-state/
  .setRpcEndpoint({
    // Set the URL via .env for local runs or via secrets when deploying to Subsquid Cloud
    // https://docs.subsquid.io/deploy-squid/env-variables/
    url: assertNotNull(process.env.RPC_ETH_HTTP, "No RPC endpoint supplied"),
    // More RPC connection options at https://docs.subsquid.io/evm-indexing/configuration/initialization/#set-data-source
    rateLimit: 10,
  })
  .setFinalityConfirmation(75)
  .setBlockRange({
    from: 35116770, 
  })
  .addLog({
    address: ["0x0551c568a3FaBDc2b0259d82893F41f31C041328"],
    topic0: [
      // events
      eventPlatformAbi.events.EventCancelled.topic,
      eventPlatformAbi.events.EventCreated.topic,
      eventPlatformAbi.events.EventUpdated.topic,
      // payments
      eventPlatformAbi.events.PaymentReceived.topic,
      eventPlatformAbi.events.RefundIssued.topic,
      // registrations
      eventPlatformAbi.events.RegistrationPending.topic,
      eventPlatformAbi.events.RegistrationApproved.topic,
      eventPlatformAbi.events.RegistrationRejected.topic,
      // ticketing
      eventPlatformAbi.events.TicketIssued.topic,
      eventPlatformAbi.events.TicketPriceUpdated.topic,
      eventPlatformAbi.events.CheckedIn.topic,
      // misc
      eventPlatformAbi.events.TokenWhiteListed.topic,
      eventPlatformAbi.events.ProfitWithdrawn.topic,
      eventPlatformAbi.events.ProfitGenerated.topic,
    ],
  });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Context = DataHandlerContext<Store, Fields>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;

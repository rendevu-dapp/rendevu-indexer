// abis
import * as eventPlatformAbi from "./abi/event-platform";

// processor
import { db, processor } from "./processor";

// handlers
import { handleEventCreated, handleEventUpdated } from "./handlers";

const CONTRACT_ADDRESS = "0xE3fE5E26010Ce744264f58889cefd7Fd5bE62e4c";

processor.run(db, async (ctx) => {
  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      // get the event platform contract instance
      const eventContract = new eventPlatformAbi.Contract(
        ctx,
        log.block,
        CONTRACT_ADDRESS
      );

      // match the log to the event
      switch (log.topics[0]) {
        // events
        case eventPlatformAbi.events.EventCreated.topic:
          // handle event created
          await handleEventCreated(ctx, log, eventContract);
          break;
        case eventPlatformAbi.events.EventUpdated.topic:
          // handle event updated
          await handleEventUpdated(ctx, log, eventContract);
          break;
        default:
          continue; // skip logs that are not from the event platform contract
      }
    }
  }
});

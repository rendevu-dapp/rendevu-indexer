// abis
import * as eventPlatformAbi from "./abi/event-platform";

// processor
import { db, processor } from "./processor";

// handlers
import { handleEventCreated, handleEventUpdated, handleEventCancelled, handleTicketIssued, handleTicketPriceUpdated, handleCheckedIn, handleRegistrationPending, handleRegistrationApproved, handleRegistrationRejected, handlePaymentReceived, handleRefundIssued, handleTokenWhitelisted, handleProfitWithdrawn, handleProfitGenerated } from "./handlers";

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
        case eventPlatformAbi.events.EventCancelled.topic:
          // handle event cancelled
          await handleEventCancelled(ctx, log);
          break;
        // ticketing
        case eventPlatformAbi.events.TicketIssued.topic:
          // handle ticket issued
          await handleTicketIssued(ctx, log);
          break;
        case eventPlatformAbi.events.TicketPriceUpdated.topic:
          // handle ticket price updated
          await handleTicketPriceUpdated(ctx, log);
          break;
        case eventPlatformAbi.events.CheckedIn.topic:
          // handle checked in
          await handleCheckedIn(ctx, log);
          break;
        // registrations
        case eventPlatformAbi.events.RegistrationPending.topic:
          // handle registration pending
          await handleRegistrationPending(ctx, log);
          break;
        case eventPlatformAbi.events.RegistrationApproved.topic:
          // handle registration approved
          await handleRegistrationApproved(ctx, log);
          break;
        case eventPlatformAbi.events.RegistrationRejected.topic:
          // handle registration rejected
          await handleRegistrationRejected(ctx, log);
          break;
        // payments
        case eventPlatformAbi.events.PaymentReceived.topic:
          // handle payment received
          await handlePaymentReceived(ctx, log);
          break;
        case eventPlatformAbi.events.RefundIssued.topic:
          // handle refund issued
          await handleRefundIssued(ctx, log);
          break;
        // misc
        case eventPlatformAbi.events.TokenWhiteListed.topic:
          // handle token whitelisted
          await handleTokenWhitelisted(ctx, log);
          break;
        case eventPlatformAbi.events.ProfitWithdrawn.topic:
          // handle profit withdrawn
          await handleProfitWithdrawn(ctx, log);
          break;
        case eventPlatformAbi.events.ProfitGenerated.topic:
          // handle profit generated
          await handleProfitGenerated(ctx, log);
          break;
        // skip logs that are not from the event platform contract
        default:
          continue; // skip logs that are not from the event platform contract
      }
    }
  }
});

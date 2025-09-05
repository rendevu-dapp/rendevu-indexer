// abis
import * as eventPlatformAbi from "../abi/event-platform";

// models
import { Event, Profit } from "../model";

// types
import type { Context, Log } from "../processor";

export async function handleProfitGenerated(ctx: Context, log: Log) {
  // decode the log
  let { eventId, token, profitAmount } =
    eventPlatformAbi.events.ProfitGenerated.decode(log);

  // load the event from the store
  const event = await ctx.store.get(Event, eventId.toString());
  if (!event) {
    ctx.log.warn(`Event with ID ${eventId} not found for profit generation.`);
    return;
  }

  // create the profit entity
  const profitId = `${eventId}-${token}-${log.block.timestamp}`;
  const profit = new Profit({
    id: profitId,
    eventId: eventId,
    token: token,
    profitAmount: profitAmount,
    createdAt: BigInt(log.block.timestamp),
    type: "Generated",
  });

  await ctx.store.upsert(profit);
  ctx.log.info(
    `Profit generated event processed for event ${eventId} token ${token}.`
  );
}

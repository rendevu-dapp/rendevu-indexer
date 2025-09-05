// abis
import * as eventPlatformAbi from "../abi/event-platform";

// models
import { Event, EventToken } from "../model";

// types
import type { Context, Log } from "../processor";

export async function handleTicketPriceUpdated(ctx: Context, log: Log) {
  // decode the log
  let { eventId, paymentToken, ticketPrice } =
    eventPlatformAbi.events.TicketPriceUpdated.decode(log);

  // load the event from the store
  const event = await ctx.store.get(Event, eventId.toString());
  if (!event) {
    ctx.log.warn(`Event with ID ${eventId} not found for ticket price update.`);
    return;
  }

  // load the event token from the store
  const eventTokenId = `${eventId}-${paymentToken}`;
  const eventToken = await ctx.store.get(EventToken, eventTokenId);
  if (!eventToken) {
    ctx.log.warn(
      `Event token with ID ${eventTokenId} not found for price update.`
    );
    return;
  }

  // update the ticket price
  eventToken.price = ticketPrice;
  await ctx.store.upsert(eventToken);

  ctx.log.info(
    `Ticket price updated for event ${eventId} token ${paymentToken} to ${ticketPrice}.`
  );
}

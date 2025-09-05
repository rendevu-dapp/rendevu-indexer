// abis
import * as eventPlatformAbi from "../abi/event-platform";

// models
import { Ticket } from "../model";

// configs
import { syncEventsQueue } from "../common/configs";

// types
import type { Context, Log } from "../processor";

export async function handleCheckedIn(ctx: Context, log: Log) {
  // decode the log
  let { eventId, attendee } = eventPlatformAbi.events.CheckedIn.decode(log);

  // load the ticket from the store
  const ticketId = `${eventId}-${attendee}`;
  const ticket = await ctx.store.get(Ticket, ticketId);
  if (!ticket) {
    ctx.log.warn(`Ticket with ID ${ticketId} not found for check-in.`);
    return;
  }

  // update the ticket status
  ticket.isUsed = true;
  ticket.checkedInAt = BigInt(log.block.timestamp);
  await ctx.store.upsert(ticket);

  ctx.log.info(`Ticket checked in for event ${eventId} attendee ${attendee}.`);

  // add the event to the sync queue
  await syncEventsQueue.add("sync-check-in", {
    eventId: eventId.toString(),
    block: log.block,
  });
  ctx.log.info(`Check-in added to sync queue: ${ticket.id}`);
}

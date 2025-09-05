// abis
import * as eventPlatformAbi from "../abi/event-platform";

// models
import { Event } from "../model";

// types
import type { Context, Log } from "../processor";

export async function handleEventCancelled(ctx: Context, log: Log) {
  // decode the log
  let { eventId } = eventPlatformAbi.events.EventCancelled.decode(log);

  // fetch the existing event from the store
  const existingEvent = await ctx.store.get(Event, eventId.toString());
  if (!existingEvent) {
    ctx.log.warn(`Event with ID ${eventId} not found for cancellation.`);
    return;
  }

  // mark the event as cancelled
  existingEvent.isActive = false;
  existingEvent.updatedAt = BigInt(log.block.timestamp);
  await ctx.store.upsert(existingEvent);
  ctx.log.info(`Event with ID ${eventId} has been cancelled.`);
}

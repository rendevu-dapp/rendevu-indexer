// abis
import * as eventPlatformAbi from "../abi/event-platform";

// models
import { Event } from "../model";

// configs
import { syncEventsQueue } from "../common/configs";

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

  // add the event to the sync queue
  await syncEventsQueue.add(
    "sync-event",
    { eventId: existingEvent.id, block: log.block },
  );
  ctx.log.info(`Event cancellation added to sync queue: ${existingEvent.id}`);
}

// abis
import * as eventPlatformAbi from "../abi/event-platform";

// models
import { Event, Registration, RegistrationStatus } from "../model";

// types
import type { Context, Log } from "../processor";

export async function handleRegistrationApproved(ctx: Context, log: Log) {
  // decode the log
  let { eventId, attendee } =
    eventPlatformAbi.events.RegistrationApproved.decode(log);

  // load the event from the store
  const event = await ctx.store.get(Event, eventId.toString());
  if (!event) {
    ctx.log.warn(
      `Event with ID ${eventId} not found for registration approval.`
    );
    return;
  }

  // load the registration entity
  const registrationId = `${eventId}-${attendee}`;
  let registration = await ctx.store.get(Registration, registrationId);
  if (!registration) {
    registration = new Registration({
      id: registrationId,
      event: event,
      attendee: attendee,
      registeredAt: BigInt(log.block.timestamp),
    });
  }

  registration.approved = true;
  registration.status = RegistrationStatus.APPROVED;
  registration.approvedAt = BigInt(log.block.timestamp);

  await ctx.store.upsert(registration);
  ctx.log.info(
    `Registration approved for event ${event.id} attendee ${attendee}.`
  );
}

// abis
import * as eventPlatformAbi from "../abi/event-platform";

// models
import { Event, Registration, RegistrationStatus } from "../model";

// types
import type { Context, Log } from "../processor";

export async function handleRegistrationPending(ctx: Context, log: Log) {
  // decode the log
  let { eventId, attendee } =
    eventPlatformAbi.events.RegistrationPending.decode(log);

  // load the event from the store
  const event = await ctx.store.get(Event, eventId.toString());
  if (!event) {
    ctx.log.warn(
      `Event with ID ${eventId} not found for registration pending.`
    );
    return;
  }

  // load or create the registration entity
  const registrationId = `${eventId}-${attendee}`;
  let registration = await ctx.store.get(Registration, registrationId);
  if (!registration) {
    registration = new Registration({
      id: registrationId,
      event: event,
      attendee: attendee,
      approved: false,
      registeredAt: BigInt(log.block.timestamp),
    });
  }
  registration.status = RegistrationStatus.PENDING;

  await ctx.store.upsert(registration);
  ctx.log.info(
    `Registration pending for event ${event.id} attendee ${attendee}.`
  );
}

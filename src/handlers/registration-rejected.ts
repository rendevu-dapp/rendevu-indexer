// abis
import * as eventPlatformAbi from "../abi/event-platform";

// models
import { Event, Registration, RegistrationStatus } from "../model";

// types
import type { Context, Log } from "../processor";

export async function handleRegistrationRejected(ctx: Context, log: Log) {
  // decode the log
  let { eventId, attendee } =
    eventPlatformAbi.events.RegistrationRejected.decode(log);

  // load the event from the store
  const event = await ctx.store.get(Event, eventId.toString());
  if (!event) {
    ctx.log.warn(
      `Event with ID ${eventId} not found for registration rejection.`
    );
    return;
  }

  // load the registration entity
  const registrationId = `${eventId}-${attendee}`;
  let registration = await ctx.store.get(Registration, registrationId);
  if (!registration) {
    ctx.log.warn(
      `Registration with ID ${registrationId} not found for rejection.`
    );
    return;
  }

  registration.approved = false;
  registration.approvedAt = null;
  registration.status = RegistrationStatus.DECLINED;

  await ctx.store.upsert(registration);
  ctx.log.info(
    `Registration rejected for event ${event.id} attendee ${attendee}.`
  );
}

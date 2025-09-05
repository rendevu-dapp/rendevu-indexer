// abis
import * as eventPlatformAbi from "../abi/event-platform";

// models
import { Ticket, Registration, Event, Payment } from "../model";

// types
import type { Context, Log } from "../processor";

export async function handleTicketIssued(ctx: Context, log: Log) {
  // decode the log
  let { eventId, attendee } = eventPlatformAbi.events.TicketIssued.decode(log);

  // load the event from the store
  const event = await ctx.store.get(Event, eventId.toString());
  if (!event) {
    ctx.log.warn(`Event with ID ${eventId} not found for ticket issuance.`);
    return;
  }

  // create or update the ticket entity
  const ticketId = `${eventId}-${attendee}`;
  let ticket = await ctx.store.get(Ticket, ticketId);
  if (!ticket) {
    ticket = new Ticket({
      id: ticketId,
      event: event,
      attendee: attendee,
      issuedAt: BigInt(log.block.timestamp),
      isUsed: false,
      checkedInAt: null,
    });

    // link to the registration and payment if they exist
    let registration = await ctx.store.get(Registration, ticketId);
    if (registration) {
      ticket.registration = registration;
    }

    let payment = await ctx.store.get(Payment, ticketId);
    if (payment) {
      ticket.payment = payment;
    }

    await ctx.store.upsert(ticket);
  }

  ctx.log.info(`Ticket issued for event ${event.id} to attendee ${attendee}.`);
}

// abis
import * as eventPlatformAbi from "../abi/event-platform";

// models
import { Event, Payment } from "../model";

// types
import type { Context, Log } from "../processor";

export async function handleRefundIssued(ctx: Context, log: Log) {
  // decode the log
  let { eventId, attendee } = eventPlatformAbi.events.RefundIssued.decode(log);

  // load the event from the store
  const event = await ctx.store.get(Event, eventId.toString());
  if (!event) {
    ctx.log.warn(`Event with ID ${eventId} not found for refund.`);
    return;
  }

  // load the payment entity
  const paymentId = `${eventId}-${attendee}`;
  let payment = await ctx.store.get(Payment, paymentId);
  if (!payment) {
    ctx.log.warn(`Payment with ID ${paymentId} not found for refund.`);
    return;
  }

  // update the payment status and amount refunded
  payment.isRefunded = true;

  await ctx.store.upsert(payment);
  ctx.log.info(
    `Refund issued for payment ${paymentId} for event ${eventId} attendee ${attendee}.`
  );
}

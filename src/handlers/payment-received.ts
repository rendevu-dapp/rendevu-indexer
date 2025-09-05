// abis
import * as eventPlatformAbi from "../abi/event-platform";

// models
import { Event, EventToken, Payment, Registration } from "../model";

// types
import type { Context, Log } from "../processor";

export async function handlePaymentReceived(ctx: Context, log: Log) {
  // decode the log
  let { eventId, paymentToken, amount, payer } =
    eventPlatformAbi.events.PaymentReceived.decode(log);

  // load the event from the store
  const event = await ctx.store.get(Event, eventId.toString());
  if (!event) {
    ctx.log.warn(`Event with ID ${eventId} not found for payment.`);
    return;
  }

  // load the event token from the store
  const eventTokenId = `${eventId}-${paymentToken}`;
  const eventToken = await ctx.store.get(EventToken, eventTokenId);
  if (!eventToken) {
    ctx.log.warn(`Event token with ID ${eventTokenId} not found for payment.`);
    return;
  }

  // create or update the payment entity
  const paymentId = `${eventId}-${payer}`;
  let payment = await ctx.store.get(Payment, paymentId);
  if (!payment) {
    payment = new Payment({
      id: paymentId,
      event: event,
      token: eventToken,
      amount: amount,
      payer: payer,
      isRefunded: false,
      paymentDate: BigInt(log.block.timestamp),
    });

    // link to the registration if it exists
    const registrationId = `${eventId}-${payer}`;
    let registration = await ctx.store.get(Registration, registrationId);
    if (registration) {
      payment.registration = registration;
    }

    await ctx.store.upsert(payment);
  }

  ctx.log.info(
    `Payment received for event ${event.id} token ${paymentToken} amount ${amount} from ${payer}.`
  );
}

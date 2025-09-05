// abis
import * as eventPlatformAbi from "../abi/event-platform";

// models
import { Event, EventMetadata, EventToken, Location } from "../model";

// helpers
import { fetchEventMetadata, getVenueType } from "../common/helpers";

// types
import type { Context, Log } from "../processor";

export async function handleEventUpdated(
  ctx: Context,
  log: Log,
  contract: eventPlatformAbi.Contract
) {
  // decode the log
  let { eventId, metadataHash, startDate } =
    eventPlatformAbi.events.EventUpdated.decode(log);

  // fetch the event details from the contract
  const eventDetails = await contract.getEvent(eventId);

  // load the existing event from the store
  const existingEvent = await ctx.store.get(Event, eventId.toString());
  if (!existingEvent) {
    ctx.log.warn(`Event with ID ${eventId} not found for update.`);
    return;
  }

  // check if the metadata has changed
  let eventMetadata = existingEvent.metadata;
  if (eventMetadata?.referenceHash !== metadataHash) {
    // fetch the updated event metadata from IPFS
    const metadata = await fetchEventMetadata(metadataHash);

    // save updated event metadata to db
    const metadataId = `${eventId}-${metadataHash}`;
    let location: Location | undefined = undefined;
    if (metadata.location) {
      const locationBaseId = metadata.location?.placeId
        ? "place-" + metadata.location.placeId
        : "coords-" +
          metadata.location.latitude +
          "-" +
          metadata.location.longitude;
      location = new Location({
        id: locationBaseId,
        placeId: metadata.location.placeId,
        name: metadata.location.name,
        address: metadata.location.address,
        latitude: metadata.location.latitude,
        longitude: metadata.location.longitude,
      });
      await ctx.store.upsert(location);
      if (eventMetadata?.location) {
        await ctx.store.remove(Location, eventMetadata.location.id);
      }
    }

    const oldMetadataId = eventMetadata?.id;
    eventMetadata = new EventMetadata({
      id: metadataId,
      referenceHash: metadataHash,
      title: metadata.title,
      description: metadata.description,
      image: metadata.image,
      location: location,
      virtualLink: metadata.virtualLink,
    });
    await ctx.store.upsert(eventMetadata);
    if (oldMetadataId) {
      await ctx.store.remove(EventMetadata, oldMetadataId);
    }

    ctx.log.info(`updated event metadata for event ${eventId}`);
  }

  // update the event model
  existingEvent.metadataHash = metadataHash;
  existingEvent.metadata = eventMetadata;
  existingEvent.startDate = startDate;
  existingEvent.endDate = eventDetails.endDate;
  existingEvent.capacity = eventDetails.capacity;
  existingEvent.venueType = getVenueType(eventDetails.venueType);
  existingEvent.isPaid = eventDetails.isPaid;
  existingEvent.requiresApproval = eventDetails.requiresApproval;
  existingEvent.updatedAt = BigInt(log.block.timestamp);

  await ctx.store.upsert(existingEvent);

  // update payment tokens
  const tokens = await contract.getPaymentTokens(eventId);
  if (tokens?.length > 0 && existingEvent.isPaid) {
    const paymentTokens: EventToken[] = [];

    for (const token of tokens) {
      const price = await contract.getTicketPrice(eventId, token);
      let eventToken = await ctx.store.get(EventToken, `${eventId}-${token}`);
      if (!eventToken) {
        eventToken = new EventToken({
          id: `${eventId}-${token}`,
          price,
          event: existingEvent,
          tokenAddress: token,
        });
      }
      paymentTokens.push(eventToken);

      await ctx.store.upsert(paymentTokens);
    }
  }

  // remove old payment tokens that are no longer associated with the event
  const existingTokens = await ctx.store.find(EventToken, {
    where: { event: existingEvent },
  });
  const nonAssociatedTokenId = new Set(
    existingTokens
      .filter((t) => !tokens.includes(t.tokenAddress))
      .map((t) => t.id)
  );
  if (nonAssociatedTokenId.size > 0) {
    await ctx.store.remove(EventToken, Array.from(nonAssociatedTokenId));
  }
  ctx.log.info(
    `Event updated: ${existingEvent.metadata.title} organized by ${existingEvent.organizer}`
  );
}

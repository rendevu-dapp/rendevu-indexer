// abis
import * as eventPlatformAbi from "../abi/event-platform";

// models
import { Event, EventMetadata, EventToken, Location } from "../model";

// helpers
import { fetchEventMetadata, getVenueType } from "../common/helpers";

// configs
import { syncEventsQueue } from "../common/configs";

// types
import type { Context, Log } from "../processor";

export async function handleEventCreated(
  ctx: Context,
  log: Log,
  contract: eventPlatformAbi.Contract
) {
  // get
  let { eventId, metadataHash, organizer, startDate } =
    eventPlatformAbi.events.EventCreated.decode(log);

  // fetch the event metadata from IPFS
  const metadata = await fetchEventMetadata(metadataHash);

  // save event metadata to db
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
  }

  const eventMetadata = new EventMetadata({
    id: metadataId,
    referenceHash: metadataHash,
    title: metadata.title,
    description: metadata.description,
    image: metadata.image,
    location: location,
    virtualLink: metadata.virtualLink,
  });
  await ctx.store.upsert(eventMetadata);

  // get the event details from the contract
  const eventDetails = await contract.getEvent(eventId);

  // create the event model
  const newEvent = new Event({
    id: eventId.toString(),
    eventId,
    metadataHash,
    organizer,
    startDate: startDate,
    metadata: eventMetadata,
    endDate: eventDetails.endDate,
    isPaid: eventDetails.isPaid,
    capacity: eventDetails.capacity,
    isActive: eventDetails.isActive,
    requiresApproval: eventDetails.requiresApproval,
    venueType: getVenueType(eventDetails.venueType),
    createdAt: BigInt(log.block.timestamp),
    updatedAt: BigInt(log.block.timestamp),
  });

  await ctx.store.upsert(newEvent);

  ctx.log.info(
    `Event model prepared: ${metadata.title} organized by ${organizer}`
  );

  // handle payment tokens for the event
  if (eventDetails.isPaid) {
    const tokens = await contract.getPaymentTokens(eventId);
    if (tokens?.length > 0) {
      const paymentTokens: EventToken[] = [];

      for (const token of tokens) {
        const price = await contract.getTicketPrice(eventId, token);
        let eventToken = await ctx.store.get(EventToken, `${eventId}-${token}`);
        if (!eventToken) {
          eventToken = new EventToken({
            id: `${eventId}-${token}`,
            price,
            event: newEvent,
            tokenAddress: token,
          });
        }
        paymentTokens.push(eventToken);
      }

      await ctx.store.upsert(paymentTokens);
    }
  }

  // add the event to the sync queue
  await syncEventsQueue.add("sync-event", {
    eventId: newEvent.id,
    block: log.block,
  });

  ctx.log.info(`Event creation added to sync queue: ${newEvent.id}`);
}

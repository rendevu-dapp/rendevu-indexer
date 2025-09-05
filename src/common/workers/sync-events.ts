// imports
import Typesense from "typesense";
import { SandboxedJob } from "bullmq";

// configs
import { typesense, AppDataSource } from "../configs";

// models
import { Event } from "../../model";

// types
import { EventJobData } from "../types";

async function syncEventsWorker(job: SandboxedJob<EventJobData>) {
  const { eventId, block } = job.data;

  try {
    // write a log to a txt file if execution reaches this point
    console.log(`Syncing event ${eventId} at block ${block.timestamp}`);

    // Get existing doc (if any)
    let existing: any = null;
    try {
      existing = await typesense
        .collections("events")
        .documents(eventId)
        .retrieve();
    } catch (err: any) {
      if (
        err instanceof Typesense.Errors.TypesenseError ||
        err?.httpStatus !== 404
      ) {
        // Document doesn't exist, continue
      } else {
        throw err;
      }
    }

    // Skip if the stored block is newer or same
    if (
      existing?.lastUpdatedBlockTimestamp &&
      existing.lastUpdatedBlockTimestamp >= block.timestamp
    ) {
      console.log(
        `Skipped event ${eventId} — newer block already in Typesense`
      );
      return;
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const eventRepository = AppDataSource.getRepository(Event);
    const event = await eventRepository.findOne({
      where: {
        id: eventId,
      },
      relations: {
        metadata: {
          location: true,
        },
        paymentTokens: true,
        registrations: true,
        tickets: true,
        payments: true,
      },
    });
    if (!event) {
      console.error(`Event ${eventId} not found in database`);
      throw new Error(`Event ${eventId} not found`);
    }

    // prepare the data for Typesense
    const typesenseEvent = {
      // event basic data
      id: event.id.toString(),
      eventId: Number(event.eventId),
      organizer: event.organizer,
      startDate: Number(event.startDate),
      endDate: Number(event.endDate),
      createdAt: Number(event.createdAt),
      updatedAt: Number(event.updatedAt),
      isActive: Boolean(event.isActive),
      isPaid: Boolean(event.isPaid),
      requiresApproval: Boolean(event.requiresApproval),
      venueType: event.venueType,
      capacity: Number(event.capacity),

      // block time stamp
      lastUpdatedBlockTimestamp: block.timestamp,

      // metadata
      metadata: {
        title: event.metadata?.title || "",
        description: event.metadata?.description || "",
        image: event.metadata?.image || "",
        virtualLink: event.metadata?.virtualLink || "",
        location: {
          name: event.metadata?.location?.name || "",
          address: event.metadata?.location?.address || "",
          latitude: event.metadata?.location?.latitude || "",
          longitude: event.metadata?.location?.longitude || "",
          placeId: event.metadata?.location?.placeId || "",
        },
      },

      // payment tokens
      paymentTokens: (event.paymentTokens ?? []).map((pt: any) => ({
        tokenAddress: pt.tokenAddress,
        price: Number(pt.price),
      })),

      // resgitrations
      registrations: (event.registrations ?? []).map((reg: any) => ({
        attendee: reg.attendee,
        status: reg.status,
        registeredAt: Number(reg.registeredAt),
      })),

      // tickets
      tickets: (event.tickets ?? []).map((ticket: any) => ({
        attendee: ticket.attendee,
        isUsed: Boolean(ticket.isUsed),
        issuedAt: Number(ticket.issuedAt),
      })),

      // payments
      payments: (event.payments ?? []).map((payment: any) => ({
        payer: payment.payer,
        amount: Number(payment.amount),
        isRefunded: Boolean(payment.isRefunded),
      })),
    };
    console.log(`prepared event data for eventid ${eventId}`);
    await typesense.collections("events").documents().upsert(typesenseEvent);

    console.log(
      `Synced event ${eventId} (block ${block.timestamp}) to Typesense`
    );
  } catch (err) {
    console.error(`Failed to sync event ${eventId}:`, err);
    throw err; // rethrow to mark the job as failed
  }
}

module.exports = syncEventsWorker;

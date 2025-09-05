// imports
import { SandboxedJob } from "bullmq";

// configs
import { AppDataSource } from "../configs";

// models
import { Event, POAP } from "../../model";

// types
import { PoapJobData } from "../types";

async function syncPoapsWorker(job: SandboxedJob<PoapJobData>) {
  const { eventId, poap: poapEvent } = job.data;

  try {
    console.log(
      `Synced poap ${eventId} (poapEventId: ${poapEvent.id}, poapFancyId: ${poapEvent.fancy_id})`
    );

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const eventRepository = AppDataSource.getRepository(Event);

    const event = await eventRepository.findOne({ where: { id: eventId } });
    if (!event) {
      return;
    }

    const poapRepository = AppDataSource.getRepository(POAP);
    const existingPoap = await poapRepository.findOneBy({
      id: poapEvent.id.toString(),
    });
    if (existingPoap) {
      // update existing record
      poapRepository.merge(existingPoap, {
        event: event,
        poapId: poapEvent.id,
        fancyId: poapEvent.fancy_id,
        name: poapEvent.name,
        description: poapEvent.description,
        imageUrl: poapEvent.image_url,
        animationUrl: poapEvent.animation_url,
        eventUrl: poapEvent.event_url,
        city: poapEvent.city,
        country: poapEvent.country,
        startDate: poapEvent.start_date,
        endDate: poapEvent.end_date,
        expiryDate: poapEvent.expiry_date,
        eventTemplateId: poapEvent.event_template_id,
        virtualEvent: poapEvent.virtual_event,
        privateEvent: poapEvent.private_event,
        dropImageDropId: poapEvent.drop_image?.drop_id,
        dropImagePublicId: poapEvent.drop_image?.public_id,
        fromAdmin: poapEvent.from_admin,
        year: poapEvent.year,
      });
      await poapRepository.save(existingPoap);
    } else {
      const poap = new POAP({
        event: event,
        id: poapEvent.id.toString(),
        poapId: poapEvent.id,
        fancyId: poapEvent.fancy_id,
        name: poapEvent.name,
        description: poapEvent.description,
        imageUrl: poapEvent.image_url,
        animationUrl: poapEvent.animation_url,
        eventUrl: poapEvent.event_url,
        city: poapEvent.city,
        country: poapEvent.country,
        startDate: poapEvent.start_date,
        endDate: poapEvent.end_date,
        expiryDate: poapEvent.expiry_date,
        eventTemplateId: poapEvent.event_template_id,
        virtualEvent: poapEvent.virtual_event,
        privateEvent: poapEvent.private_event,
        dropImageDropId: poapEvent.drop_image?.drop_id,
        dropImagePublicId: poapEvent.drop_image?.public_id,
        fromAdmin: poapEvent.from_admin,
        year: poapEvent.year,
      });
      await poapRepository.save(poap); // This handles upsert
    }
    console.log(`Successfully synced POAP ${poapEvent.id}`);
  } catch (err) {
    console.error(
      `Failed to sync POAP ${poapEvent.id} for event${eventId}:`,
      err
    );
    throw err; // rethrow to mark the job as failed
  }
}

module.exports = syncPoapsWorker;

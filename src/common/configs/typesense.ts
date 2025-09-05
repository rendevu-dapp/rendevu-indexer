// imports
import Typesense from "typesense";

export const typesense = new Typesense.Client({
  nodes: [
    {
      url: process.env.TYPESENSE_URL!,
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || "supersecret",
});

export const ensureCollections = async () => {
  try {
    await typesense.collections("events").retrieve();
  } catch (error) {
    if (error instanceof Typesense.Errors.ObjectNotFound) {
      await typesense.collections().create({
        name: "events",
        fields: [
          // Core identifiers
          // { name: "id", type: "string" }, typesense generates an id for us but id is basically a string(eventid)
          { name: "eventId", type: "int64", sort: true },
          { name: "organizer", type: "string", facet: true, sort: true },

          // Dates
          { name: "startDate", type: "int64", sort: true },
          { name: "endDate", type: "int64", sort: true },
          { name: "createdAt", type: "int64", sort: true },
          { name: "updatedAt", type: "int64", sort: true },

          // Status & flags
          { name: "isActive", type: "bool", facet: true },
          { name: "isPaid", type: "bool", facet: true },
          { name: "requiresApproval", type: "bool", facet: true },
          { name: "venueType", type: "string", facet: true },
          { name: "capacity", type: "int64" },

          // --- Nested Metadata ---
          { name: "metadata", type: "object" },
          { name: "metadata.title", type: "string", sort: true }, // searchable title
          { name: "metadata.description", type: "string" },
          { name: "metadata.image", type: "string" },
          { name: "metadata.virtualLink", type: "string" },

          // --- Nested Location ---
          { name: "metadata.location", type: "object" },
          { name: "metadata.location.name", type: "string", facet: true },
          { name: "metadata.location.address", type: "string" },
          { name: "metadata.location.latitude", type: "string" },
          { name: "metadata.location.longitude", type: "string" },
          { name: "metadata.location.placeId", type: "string", facet: true },

          // --- Nested Payment Tokens ---
          { name: "paymentTokens", type: "object[]" },

          // --- Nested Registrations ---
          { name: "registrations", type: "object[]" },

          // --- Nested Tickets ---
          { name: "tickets", type: "object[]" },

          // --- Nested Payments ---
          { name: "payments", type: "object[]" },

          // lastUpdatedBlockTimestamp for sync tracking
          { name: "lastUpdatedBlockTimestamp", type: "int64", sort: true },
        ],
        enable_nested_fields: true,
        default_sorting_field: "startDate",
      } as any);
    } else {
      throw error;
    }
  }
};

export const getVenueType = (venueType: number): string => {
  let eventVenueType: string;
  switch (venueType) {
    case 0:
      eventVenueType = "Physical";
      break;
    case 1:
      eventVenueType = "Online";
      break;
    case 2:
      eventVenueType = "Hybrid";
      break;
    default:
      eventVenueType = "Physical";
      break;
  }
  return eventVenueType;
};

export const toSerializable = <T>(obj: T) => {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  ) as T;
}
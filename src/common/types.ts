import { Block } from "../processor";

export type EventJobData = { eventId: string; block: Block };

export type PoapJobData = {
  eventId: string;
  poap: POAPEvent;
};

export type POAPImageGateway = {
  image_id: string;
  filename: string;
  mime_type: string;
  url: string;
  type: string;
}

export type POAPDropImage = {
  public_id?: string;
  drop_id: number;
  gateways?: POAPImageGateway[] | null;
}

export type POAPEvent = {
  id: number;
  fancy_id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  event_url?: string;
  image_url: string;
  animation_url?: string;
  year: number;
  start_date: string;
  end_date: string;
  expiry_date: string;
  from_admin: boolean;
  virtual_event: boolean;
  event_template_id: number;
  private_event: boolean;
  drop_image: POAPDropImage;
}
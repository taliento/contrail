import { BookingDetailsLink, PricingOption } from './';

export class Itinerary {
  OutboundLegId: string;
  InboundLegId: string;
  PricingOptions: Array<PricingOption>;
  BookingDetailsLink: BookingDetailsLink;
  // ui param
  selected = false;
}

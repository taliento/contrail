import { BookingDetailsLink, PricingOption } from './';

export class Itinerary {
  OutboundLegId: string;
  InboundLegId: string;
  PricingOptions: PricingOption[];
  BookingDetailsLink: BookingDetailsLink;
  // ui param
  selected = false;
}

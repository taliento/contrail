import { Carrier, Place } from '.';

export class QuoteLeg {
  CarrierIds: number[];
  Carriers: Carrier[];
  OriginId: number;
  DestinationId: number;
  Origin: Place;
  Destination: Place;
  DepartureDate: string;
}

export class Quote {
  QuoteId: number;
  MinPrice: number;
  Direct: boolean;
  QuoteDateTime: string;
  OutboundLeg: QuoteLeg;
  InboundLeg: QuoteLeg;
}

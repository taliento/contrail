import { Carrier, Place, QuoteLeg} from '.';

export class Quote {
  QuoteId: number;
  MinPrice: number;
  Direct: boolean;
  QuoteDateTime: string;
  OutboundLeg: QuoteLeg;
  InboundLeg: QuoteLeg;
}

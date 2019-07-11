import { Quote } from '.';

export class OutboundDate {
  PartialDate: any;
  QuoteIds: Array<any>;
}

export class Dates {
  OutboundDates: Array<OutboundDate>;
}

export class Suggestion {
  Dates: Dates;
  Quotes: Array<Quote>;
  Places: Array<any>;
  Carriers: Array<any>;
  Currencies: Array<any>;
}

import { Quote } from '.';

export class SuggestionDates {
  OutboundDates: Array<SuggestionDate>;
}


export class SuggestionDate {
  PartialDate: string;
  QuoteIds: Array<string>;
}

export class Suggestion {
  Dates: SuggestionDates;
  Quotes: Array<Quote>;
  Places: Array<any>;
  Carriers: Array<any>;
  Currencies: Array<any>;
}

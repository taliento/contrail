import { Quote } from '.';

export class SuggestionDates {
  OutboundDates: SuggestionDate[];
}

export class SuggestionDate {
  PartialDate: string;
  QuoteIds: string[];
}

export class Suggestion {
  Dates: SuggestionDates;
  Quotes: Quote[];
  Places: any[];
  Carriers: any[];
  Currencies: any[];
}

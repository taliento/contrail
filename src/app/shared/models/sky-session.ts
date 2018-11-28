import { Place } from './';

export class SkySession {
  adults: number;
  children: number;
  originPlace: Place;
  destinationPlace: Place;
  inboundDate: string;
  outboundDate: string;
  cabinClass: string;
  sessionkey: string;
  country = 'IT';
  currency = 'EUR';
  locale = 'it';

  constructor(sessionkey: string) {
    this.sessionkey = sessionkey;
  }
}

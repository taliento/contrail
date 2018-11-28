import { Itinerary, Leg, Segment, Carrier, Agent, PollResultPlace, Currency } from './';

export class PollSessionResult {
  SessionKey: string;
  Query: any;
  Status: string;
  Itineraries: Array<Itinerary>;
  Legs: Array<Leg>;
  Segments: Array<Segment>;
  Carriers: Array<Carrier>;
  Agents: Array<Agent>;
  Places: Array<PollResultPlace>;
  Currencies: Array<Currency>;
}

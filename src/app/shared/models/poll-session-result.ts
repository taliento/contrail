import { Agent, Carrier, Currency, Itinerary, Leg, PollResultPlace, Segment } from './';

export class PollSessionResult {
  SessionKey: string;
  Query: any;
  Status: string;
  Itineraries: Itinerary[];
  Legs: Leg[];
  Segments: Segment[];
  Carriers: Carrier[];
  Agents: Agent[];
  Places: PollResultPlace[];
  Currencies: Currency[];
}

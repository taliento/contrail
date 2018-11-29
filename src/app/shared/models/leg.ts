export class Leg {
  Id: string;
  SegmentsId: number[];
  OriginStation: number;
  DestinationStation: number;
  Departure: Date;
  Arrival: Date;
  Duration: number;
  JourneyMode: string;
  Stops: any[];
  Carriers: number[];
  OperatingCarriers: number[];
  Directionality: string;
  FlightNumbers: any[];
}

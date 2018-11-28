export class Leg {
  Id: string;
  SegmentsId: Array<number>;
  OriginStation: number;
  DestinationStation: number;
  Departure: Date;
  Arrival: Date;
  Duration: number;
  JourneyMode: string;
  Stops: Array<any>;
  Carriers: Array<number>;
  OperatingCarriers: Array<number>;
  Directionality: string;
  FlightNumbers: Array<any>;
}

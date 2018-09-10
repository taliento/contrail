export class Segment {
  Id: number;
  OriginStation: number;
  DestinationStation: number;
  DepartureDateTime: Date;
  ArrivalDateTime: Date;
  Duration: number;
  JourneyMode: string;
  Carrier: number;
  OperatingCarrier: number;
  Directionality: string;
  FlightNumber: number;
}

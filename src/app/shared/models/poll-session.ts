export class PollSession {
  sessionkey: string;
  stops: number;

  constructor(sessionkey: string, stops: number) {
    this.sessionkey = sessionkey;
    this.stops = stops;
  }
}

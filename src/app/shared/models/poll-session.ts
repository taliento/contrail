export class PollSession {
  sessionkey: string;
  stops: number;
  pageIndex = 1;
  pageSize = 5;
  collectionSize: number;

  constructor(sessionkey: string, stops: number) {
    this.sessionkey = sessionkey;
    this.stops = stops;
  }
}

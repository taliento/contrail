import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AService } from "./aservice.service";
import { Observable } from "rxjs";
import { SkySession, PollSessionResult, PollSession, Itinerary } from "../models";
import { map } from "rxjs/operators";

const SUFFIX = "/skyscanner";
const MOCK_SESSION =
  "5cc3da28b3f04a45bd6d29e345f7c467_rrsqbjcb_cd8283034710069eed7028483edbcb3e";

const mockPollSessionResults = require("../mock/pollSessionResult.json");

@Injectable()
export class SkyScannerService extends AService {

  private currentSession: SkySession;
  private pollSessionResult: PollSessionResult;
  private selectedItinerary: Itinerary;

  constructor(http: HttpClient) {
    super(http);
  }

  selectItinerary(itinerary: Itinerary) {
    this.selectedItinerary = itinerary;
    this.selectedItinerary.selected = true;
  }

  removeSelectedItinerary() {
    this.selectedItinerary.selected = false;
    this.selectedItinerary = null;
  }

  getSelectedItinerary(): Itinerary {
    return this.selectedItinerary;
  }

  setCurrentSession(session: SkySession): void {
    //FIXME MONGO
    this.currentSession = session;
  }

  getCurrentSession(): SkySession {
    //FIXME MONGO
    return new SkySession(MOCK_SESSION); //TESTING
    // return this.currentSession;
  }

  getMockPollSessionResults(): PollSessionResult {
    return mockPollSessionResults;
  }

  getCachedPollSessionResult(): PollSessionResult {
    return this.pollSessionResult;
  }

  getCachedItinerary(n: number) {
    return Object.assign({}, this.pollSessionResult.Itineraries[n]) ;
  }

  cachePollSessionResults(result: PollSessionResult) {
    this.pollSessionResult = result;
  }

  createSession(session: SkySession): Observable<string> {
    return this.http
      .post<any>(this.apiUrl + SUFFIX + "/createSession", session)
      .pipe(
        map(response =>
          response.location.substring(
            response.location.lastIndexOf("/") + 1,
            response.location.length
          )
        )
      );
  }

  pollSessionResults(pollSession: PollSession): Observable<PollSessionResult> {
    const uri = this.apiUrl + SUFFIX +
      `/pollSessionResults/${pollSession.sessionkey}/${pollSession.stops}`;///${pollSession.pageIndex-1}/${pollSession.pageSize}
    return this.http.get<PollSessionResult>(uri);
  }

  getPlaces(query: string): Observable<any> {
    //FIXME MONGO cache
    return this.http
      .get<any>(this.apiUrl + SUFFIX + `/getPlaces/${query}`)
      .pipe(map(response => response.Places));
  }
}

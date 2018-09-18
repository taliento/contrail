import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AService } from "./aservice.service";
import { Observable } from "rxjs";
import { SkySession, PollSessionResult, PollSession, Itinerary } from "../models";
import { map } from "rxjs/operators";

const SUFFIX = "/skyscanner";
<<<<<<< HEAD
// const MOCK_SESSION =
//   "8ea526ce242449f885dc7f047d2512c2_rrsqbjcb_cd8283034710069eed7028483edbcb3e";
=======
const MOCK_SESSION =
  "9ecd296170264c13b32075587725d73a_rrsqbjcb_cd8283034710069eed7028483edbcb3e";
>>>>>>> dc09a4cbf2e7d5f9312866db3af7ec013436399d

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
    // return new SkySession(MOCK_SESSION); //TESTING
    return this.currentSession;
  }

  getCachedPollSessionResult(): PollSessionResult {
    return this.pollSessionResult;
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
      `/pollSessionResults/${pollSession.sessionkey}/${pollSession.stops}`;
    return this.http.get<PollSessionResult>(uri);
  }

  getPlaces(query: string): Observable<any> {
    //FIXME MONGO cache
    return this.http
      .get<any>(this.apiUrl + SUFFIX + `/getPlaces/${query}`)
      .pipe(map(response => response.Places));
  }
}

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AService } from "./aservice.service";
import { Observable } from "rxjs";
import { Place, SkySession, PollSessionResult, PollSession } from "../models";
import { map } from "rxjs/operators";

const SUFFIX = "/skyscanner";
const MOCK_SESSION =
  "4d2b37b909f546eb8271dda3fc721766_rrsqbjcb_06a13f0a788e803fcc56e78802891a26";

@Injectable()
export class SkyScannerService extends AService {
  private currentSession: SkySession;
  private pollSessionResult: PollSessionResult;

  constructor(http: HttpClient) {
    super(http);
  }

  setCurrentSession(session: SkySession): void {
    //FIXME MONGO
    this.currentSession = session;
  }

  getCurrentSession(): SkySession {
    //FIXME MONGO
    // return this.currentSession;
    return new SkySession(MOCK_SESSION); //TESTING
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
    const uri =
      this.apiUrl +
      SUFFIX +
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

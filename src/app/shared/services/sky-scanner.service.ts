import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AService } from "./aservice.service";
import { Observable } from "rxjs";
import { Place, SkySession, PollSessionResult } from "../models";
import { map } from "rxjs/operators";

const SUFFIX = "/skyscanner";
const mockPollReulst = require("../../../assets/mock/poll-result.json");

const MOCK_SESSION = "3520228ae425407ca8ebcdf2e3aac081_rrsqbjcb_06a13f0a788e803fcc56e78802891a26";

@Injectable()
export class SkyScannerService extends AService {

  private currentSession: SkySession;
  private pollSessionResult: PollSessionResult;

  constructor(http: HttpClient) {
    super(http);
  }

  setCurrentSession(session: SkySession): void { //FIXME MONGO
    this.currentSession = session;
  }

  getCurrentSession(): SkySession { //FIXME MONGO
    return new SkySession(MOCK_SESSION);
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

  getPlaces(query: string): Observable<any> {  //FIXME MONGO cache
    return this.http
      .get<any>(this.apiUrl + SUFFIX + `/getPlaces/${query}`)
      .pipe(map(response => response.Places));
  }

  pollSessionResults(sessionkey: string): Observable<PollSessionResult> {
    return this.http.get<PollSessionResult>(
      this.apiUrl + SUFFIX + `/pollSessionResults/${sessionkey}`
    );
  }

  cachePollSessionResults(result: PollSessionResult) { //FIXME MONGO
    this.pollSessionResult = result;
  }

  getCachedPollSessionResult() : PollSessionResult { //FIXME MONGO
    return mockPollReulst;
  }
}

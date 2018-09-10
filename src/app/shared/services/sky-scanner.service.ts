import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AService } from './aservice.service';
import { Observable } from 'rxjs';
import { Place, SkySession, PollSessionResult } from '../models';
import { map } from 'rxjs/operators'


const SUFFIX = '/skyscanner';

@Injectable()
export class SkyScannerService extends AService {

  private currentSession: SkySession;

  constructor(http: HttpClient) {
    super(http);
  }

  setCurrentSession(session: SkySession): void {
    this.currentSession = session;
  }

  getCurrentSession(): SkySession {
    return this.currentSession;
  }

  createSession(session: SkySession): Observable<string> {
    return this.http.post<any>(this.apiUrl + SUFFIX + '/createSession', session)
    .pipe(
      map(response => response.location.substring(response.location.lastIndexOf('/')+1, response.location.length))
    );
  }

  getPlaces(query: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + SUFFIX + `/getPlaces/${query}`)
    .pipe(
        map(response => response.Places)
      );
  }

  pollSessionResults(sessionkey: string): Observable<PollSessionResult> {
    return this.http.get<PollSessionResult>(this.apiUrl + SUFFIX + `/pollSessionResults/${sessionkey}`);
  }

}

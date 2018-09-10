import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AService } from './aservice.service';
import { Observable } from 'rxjs';
import { Place } from '../models';
import { map } from 'rxjs/operators'


const SUFFIX = '/skyscanner';

@Injectable()
export class SkyScannerService extends AService {

  constructor(http: HttpClient) {
    super(http);
  }

  createSession(): Observable<any> {
    return this.http.post<any>(this.apiUrl + SUFFIX + '/createSession', null);
  }

  getPlaces(query: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + SUFFIX + `/getPlaces/${query}`).pipe(
        map(response => response.Places)
      );
  }

}

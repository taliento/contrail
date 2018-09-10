import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AService } from './aservice.service';
import { Observable } from 'rxjs';
import { Place } from '../models';

const SUFFIX = '/skyscanner';

@Injectable()
export class SkyScannerService extends AService {

  constructor(http: HttpClient) {
    super(http);
  }

  createSession(): Observable<any> {
    return this.http.post<any>(this.apiUrl + SUFFIX + '/createSession', null);
  }

  getPlaces(query: string): Observable<Array<Place>> {
    return this.http.get<Array<Place>>(this.apiUrl + SUFFIX + `/getPlaces/${query}`);
  }

}

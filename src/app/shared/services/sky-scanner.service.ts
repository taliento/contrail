import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AService } from './aservice.service';
import { Observable } from 'rxjs';

const SUFFIX = '/skyscanner';

@Injectable()
export class SkyScannerService extends AService {

  constructor(http: HttpClient) {
    super(http);
  }

  createSession(): Observable<any> {
    return this.http.post<any>(this.apiUrl + SUFFIX + '/createSession', null);
  }

}

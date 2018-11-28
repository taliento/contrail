import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class AService {

  apiUrl = '';

  constructor(protected http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  protected handleError(error: any): Promise<any> {// FIXME handle error
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message);
  }
}

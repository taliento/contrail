import { Injectable } from '@angular/core';
import { AService } from './aservice.service';
import { User } from '../models';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService extends AService {
  userValue = new Subject<User>();

  constructor(http: HttpClient) {
    super(http);
  }

  signin(user: User):  Observable<User> {
    return this.http.post<User>(this.apiUrl + '/signin', user)
    .pipe(
      map(response => {
        // login successful if there's a jwt token in the response
        if (response && response.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.setUser(response);
          return response;
        }
        return null;
      })
    );
  }

  signup(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/signup', user)
    .pipe(
      map(response => {
        // login successful if there's a jwt token in the response
        if (response && response.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.setUser(response);
          return response;
        }
        return null;
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.userValue.next(null);
  }

  setUser(value: User) {
    localStorage.setItem('currentUser', JSON.stringify(value));
    this.userValue.next(value); // this will make sure to tell every subscriber about the change.
  }

  getUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
}

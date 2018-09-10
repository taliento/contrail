import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { SkyScannerService } from '../shared/services';
import { SkySession } from '../shared/models';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss'
  ]
})
export class HomeComponent implements OnInit {

  profileForm: FormGroup;

  success: any;
  loading: boolean = false;

  session: SkySession;

  constructor(private skyScanner: SkyScannerService) { }

  ngOnInit() {

    this.session = new SkySession();

    this.profileForm = new FormGroup({
      'firstName': new FormControl(this.session.firstName, Validators.required),
      'lastName': new FormControl(this.session.lastName, Validators.required),
      'adults': new FormControl(this.session.adults, [Validators.min(1), Validators.max(8), Validators.required]),
      'originPlace': new FormControl(this.session.originPlace, Validators.required)
    });
  }

  get firstName() { return this.profileForm.get('firstName'); }

  get lastName() { return this.profileForm.get('lastName'); }

  get adults() { return this.profileForm.get('adults'); }

  get originPlace() { return this.profileForm.get('originPlace'); }

  createSession() {
    this.loading = true;
    this.skyScanner.createSession()
    .subscribe(result => {
      console.log(result);
      this.loading = false;
      this.success = result;
    },
    error => {
      this.loading = false;
      console.log(error);
    });
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this._service.search(term).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )



}

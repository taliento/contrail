import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  forbiddenPlaceValidator,
  inboundDateValidator,
} from '../shared/directives/session-validator.directive';
import { Place, SkySession } from '../shared/models';
import { AlertService, SkyScannerService, UserService } from '../shared/services';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit {
  profileForm: FormGroup;
  session: SkySession;
  loading = false;
  ticketType = 'return';
  searching = false;
  searchingDestination = false;
  searchFailed: boolean;
  searchDestinationFailed: boolean;

  constructor(
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private alertService: AlertService,
    private skyScanner: SkyScannerService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
  ) {
    this.session = this.skyScanner.getCurrentSession();
  }

  ngOnInit() {
    this.profileForm = new FormGroup({
      adults: new FormControl(null, [
        Validators.min(1),
        Validators.max(8),
        Validators.required,
      ]),
      children: new FormControl(null, [Validators.max(8), Validators.required]),
      originPlace: new FormControl(null, [
        Validators.required,
        forbiddenPlaceValidator(),
      ]),
      destinationPlace: new FormControl(null, [
        Validators.required,
        forbiddenPlaceValidator(),
      ]),
      outboundDate: new FormControl(null, Validators.required),
      inboundDate: new FormControl(null, inboundDateValidator(this.ticketType)),
      cabinClass: new FormControl(null, Validators.required),
    });

    this.setDefaults();

    this.onFormChanges();
  }

  onFormChanges(): void {
    this.profileForm.get('outboundDate').valueChanges.subscribe((val) => {
      if (this.ticketType !== 'return') {
        return;
      }
      const outbound = new Date(this.ngbDateParserFormatter.format(val));
      const inbound = new Date(
        this.ngbDateParserFormatter.format(
          this.profileForm.get('inboundDate').value,
        ),
      );
      if (inbound > outbound) {
        return;
      }
      outbound.setDate(outbound.getDate() + 7); // 1 week
      this.profileForm.get('inboundDate').setValue({
        year: outbound.getFullYear(),
        month: outbound.getMonth() + 1,
        day: outbound.getDate(),
      });
    });
  }

  setDefaults() {
    const today = new Date();
    this.profileForm.get('outboundDate').setValue({
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    });
    // 1 week
    today.setDate(today.getDate() + 7);
    this.profileForm.get('inboundDate').setValue({
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    });
    this.profileForm.get('adults').setValue(1);
    this.profileForm.get('children').setValue(0);
    this.profileForm.get('cabinClass').setValue('economy');
  }

  switchPlace() {
    const origin = this.profileForm.get('originPlace').value;
    const destination = this.profileForm.get('destinationPlace').value;
    this.profileForm.get('originPlace').setValue(destination);
    this.profileForm.get('destinationPlace').setValue(origin);
  }

  switchDate() {
    const inboundDate = this.profileForm.get('inboundDate').value;
    const outboundDate = this.profileForm.get('outboundDate').value;
    this.profileForm.get('inboundDate').setValue(outboundDate);
    this.profileForm.get('outboundDate').setValue(inboundDate);
  }

  getCabinTravellersLabel() {
    const travellers = this.adults.value + this.children.value;
    return (
      travellers +
      ((travellers > 1 ? ' travellers' : ' adult') +
        ', ' +
        this.cabinClass.value)
    );
  }

  get adults() {
    return this.profileForm.get('adults');
  }

  get children() {
    return this.profileForm.get('children');
  }

  get originPlace() {
    return this.profileForm.get('originPlace');
  }

  get destinationPlace() {
    return this.profileForm.get('destinationPlace');
  }

  get inboundDate() {
    return this.profileForm.get('inboundDate');
  }

  get outboundDate() {
    return this.profileForm.get('outboundDate');
  }

  get cabinClass() {
    return this.profileForm.get('cabinClass');
  }

  createSession() {
    this.loading = true;
    const formValue = this.profileForm.value;
    formValue.outboundDate = this.ngbDateParserFormatter.format(
      formValue.outboundDate,
    );
    if (this.ticketType === 'return') {
      formValue.inboundDate = this.ngbDateParserFormatter.format(
        formValue.inboundDate,
      );
    } else {
      formValue.inboundDate = null;
    }
    formValue.country = this.session.country;
    formValue.currency = this.session.currency;
    formValue.locale = this.session.locale;
    formValue.user = this.userService.getUser();
    this.skyScanner.createSession(formValue).subscribe(
      (result) => {
        this.loading = false;
        this.session = this.profileForm.value;
        this.session.sessionkey = result;
        this.skyScanner.setCurrentSession(this.session);
        this.gotItineraries();
      },
      (error) => {
        this.loading = false;
        this.alertService.error(JSON.stringify(error));
      },

    );
  }

  gotItineraries(): void {
    this.router.navigate(['../itineraries'], { relativeTo: this.route });
  }

  searchOriginPlace = (text$: Observable<string>) => this.search(text$, true);

  searchDestinationPlace = (text$: Observable<string>) =>
    this.search(text$, false)

  search = (text$: Observable<string>, originPlace: boolean) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(
        () =>
          originPlace
            ? (this.searching = true)
            : (this.searchingDestination = true),
      ),
      switchMap((term) =>
        this.skyScanner.getPlaces(term).pipe(
          tap(
            () =>
              originPlace
                ? (this.searchFailed = false)
                : (this.searchDestinationFailed = false),
          ),
          catchError((error) => {
            console.log(error);
            originPlace
              ? (this.searchFailed = true)
              : (this.searchDestinationFailed = true);
            return of([]);
          }),
        ),
      ),
      tap(
        () =>
          originPlace
            ? (this.searching = false)
            : (this.searchingDestination = false),
      ),
    )

  formatter = (x: { PlaceName: string; CountryName: string }) => x.PlaceName;
}

import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { SkyScannerService } from "../shared/services";
import { SkySession } from "../shared/models";
import { Observable, of } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  switchMap
} from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  profileForm: FormGroup;
  session: SkySession;
  loading: boolean = false;

  searching: boolean = false;
  searchingDestination: boolean = false;
  searchFailed: boolean;
  searchDestinationFailed: boolean;

  constructor(private skyScanner: SkyScannerService, private router: Router) {}

  ngOnInit() {
    this.session = new SkySession();

    this.profileForm = new FormGroup({
      firstName: new FormControl(this.session.firstName, Validators.required),
      lastName: new FormControl(this.session.lastName, Validators.required),
      adults: new FormControl(this.session.adults, [
        Validators.min(1),
        Validators.max(8),
        Validators.required
      ]),
      originPlace: new FormControl(
        this.session.originPlace,
        Validators.required
      ),
      destinationPlace: new FormControl(
        this.session.destinationPlace,
        Validators.required
      ),
      inboundDate: new FormControl(
        this.session.inboundDate,
        Validators.required
      ),
      outboundDate: new FormControl(
        this.session.outboundDate,
        Validators.required
      )
    });

    this.setDefaults();
  }

  setDefaults() {
    var today = new Date();
    this.profileForm
      .get("inboundDate")
      .setValue({
        year: today.getFullYear(),
        month: today.getMonth(),
        day: today.getDate()
      });
    //1 week
    today.setDate(today.getDate() + 7);
    this.profileForm
      .get("outboundDate")
      .setValue({
        year: today.getFullYear(),
        month: today.getMonth(),
        day: today.getDate()
      });
    this.profileForm.get("adults").setValue(1);
  }

  get firstName() {
    return this.profileForm.get("firstName");
  }

  get lastName() {
    return this.profileForm.get("lastName");
  }

  get adults() {
    return this.profileForm.get("adults");
  }

  get originPlace() {
    return this.profileForm.get("originPlace");
  }

  get destinationPlace() {
    return this.profileForm.get("destinationPlace");
  }

  get inboundDate() {
    return this.profileForm.get("inboundDate");
  }

  get outboundDate() {
    return this.profileForm.get("outboundDate");
  }

  createSession() {
    this.loading = true;
    this.skyScanner.createSession(this.profileForm.value).subscribe(
      result => {
        console.log(result);
        this.loading = false;
        this.session = this.profileForm.value;
        this.session.sessionkey = result;
        this.skyScanner.setCurrentSession(this.session);
        this.gotItineraries();
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  gotItineraries(): void {
    console.log("redirecting...");
    this.router.navigate(["itineraries"]);
  }

  searchOriginPlace = (text$: Observable<string>) => this.search(text$, true);

  searchDestinationPlace = (text$: Observable<string>) =>
    this.search(text$, false);

  search = (text$: Observable<string>, originPlace: boolean) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(
        () =>
          originPlace
            ? (this.searching = true)
            : (this.searchingDestination = true)
      ),
      switchMap(term =>
        this.skyScanner.getPlaces(term).pipe(
          tap(
            () =>
              originPlace
                ? (this.searchFailed = false)
                : (this.searchDestinationFailed = false)
          ),
          catchError(error => {
            console.log(error);
            originPlace
              ? (this.searchFailed = true)
              : (this.searchDestinationFailed = true);
            return of([]);
          })
        )
      ),
      tap(
        () =>
          originPlace
            ? (this.searching = false)
            : (this.searchingDestination = false)
      )
    );

  formatter = (x: { PlaceName: string; CountryName: string }) =>
    x.PlaceName + " - " + x.CountryName;
}

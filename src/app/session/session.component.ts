import { Component, OnInit } from "@angular/core";
import { NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { SkyScannerService, AlertService } from "../shared/services";
import { SkySession, Place } from "../shared/models";
import { Observable, of } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  switchMap
} from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { forbiddenPlaceValidator } from "../shared/directives/forbidden-place.directive";

@Component({
  selector: "app-session",
  templateUrl: "./session.component.html",
  styleUrls: ["./session.component.scss"]
})
export class SessionComponent implements OnInit {
  profileForm: FormGroup;
  session: SkySession;
  loading: boolean = false;

  searching: boolean = false;
  searchingDestination: boolean = false;
  searchFailed: boolean;
  searchDestinationFailed: boolean;

  constructor(
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private alertService: AlertService,
    private skyScanner: SkyScannerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.session = new SkySession(null);

    this.profileForm = new FormGroup({
      adults: new FormControl(null, [
        Validators.min(1),
        Validators.max(8),
        Validators.required
      ]),
      children: new FormControl(null, [Validators.max(8), Validators.required]),
      originPlace: new FormControl({ disabled: this.searching, value: null }, [
        Validators.required,
        forbiddenPlaceValidator()
      ]),
      destinationPlace: new FormControl(
        { disabled: this.searchingDestination, value: null },
        [Validators.required, forbiddenPlaceValidator()]
      ),
      inboundDate: new FormControl(null, Validators.required),
      outboundDate: new FormControl(null, Validators.required),
      cabinClass: new FormControl(null, Validators.required)
    });

    this.setDefaults();
  }

  setDefaults() {
    var today = new Date();
    this.profileForm.get("outboundDate").setValue({
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    });

    //1 week
    today.setDate(today.getDate() + 7);
    this.profileForm.get("inboundDate").setValue({
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    });
    this.profileForm.get("adults").setValue(1);
    this.profileForm.get("children").setValue(0);
    this.profileForm.get("cabinClass").setValue("economy");
  }

  switchPlace() {
    var origin = this.profileForm.get("originPlace").value;
    var destination = this.profileForm.get("destinationPlace").value;
    this.profileForm.get("originPlace").setValue(destination);
    this.profileForm.get("destinationPlace").setValue(origin);
  }

  switchDate() {
    var inboundDate = this.profileForm.get("inboundDate").value;
    var outboundDate = this.profileForm.get("outboundDate").value;
    this.profileForm.get("inboundDate").setValue(outboundDate);
    this.profileForm.get("outboundDate").setValue(inboundDate);
  }

  get adults() {
    return this.profileForm.get("adults");
  }

  get children() {
    return this.profileForm.get("children");
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

  get cabinClass() {
    return this.profileForm.get("cabinClass");
  }

  createSession() {
    console.log("searching...");
    this.loading = true;

    var formValue = this.profileForm.value;
    console.log("form values: " + JSON.stringify(formValue));

    formValue.inboundDate = this.ngbDateParserFormatter.format(
      formValue.inboundDate
    );
    formValue.outboundDate = this.ngbDateParserFormatter.format(
      formValue.outboundDate
    );

    this.skyScanner.createSession(formValue).subscribe(
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
        this.alertService.error(error);
      }
    );
  }

  gotItineraries(): void {
    console.log("redirecting...");

    this.router.navigate(["../itineraries"], { relativeTo: this.route });
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

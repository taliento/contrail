import { Component, ViewChild, ElementRef, NgZone, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormControl  } from '@angular/forms';
import { MapsAPILoader, AgmMap  } from '@agm/core';
import { SkyScannerService, AlertService } from "../shared/services/";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { Subject } from "rxjs/internal/Subject";
import { SkySession, Suggestion } from "../shared/models/";

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuggestionComponent implements OnInit {
  @Input() mapTitle;
  @Input() mapLat;
  @Input() mapLng;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  public searchControl: FormControl;
  private unsubscribe: Subject<void> = new Subject();
  private skySession: SkySession;
  suggestions: Array<Suggestion>;
  loading = false;

  constructor(
    private ref: ChangeDetectorRef,
    private alertService: AlertService,
    private skyScannerService: SkyScannerService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { 
    this.skySession = this.skyScannerService.getCurrentSession();
  }

  ngOnInit() {
    this.searchControl = new FormControl();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * map output
   **/
  loadSuggestions(place) {
    this.loading = true;
    this.skyScannerService.getPlaces(place)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (result) => {
          this.skySession.originPlace = result[0]; //FIXME
          this.skyScannerService.getSuggestions(this.skySession)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(
              (resultSuggestions) => {
                this.loading = false;
                this.suggestions = resultSuggestions;
                this.ref.markForCheck();
              },
              (error) => {
                this.loading = false;
                this.alertService.error(JSON.stringify(error));
              }
            );
        },
        (error) => {
          this.loading = false;
          this.alertService.error(JSON.stringify(error));
        }
      );
  }
}

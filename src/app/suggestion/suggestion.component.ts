import { Component, ViewChild, ElementRef, NgZone, OnInit, Input } from '@angular/core';
import { FormControl  } from '@angular/forms';
import { MapsAPILoader, AgmMap  } from '@agm/core';
import { SkyScannerService } from "../shared/services/";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { Subject } from "rxjs/internal/Subject";
import { SkySession } from "../shared/models/";

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss']
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
  suggestions: Array<any>;
  loading = true;

  constructor(
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

  loadSuggestions(place) {
    this.loading = true;
    this.skyScannerService.getSuggestions(this.skySession.country, this.skySession.currency, this.skySession.locale,place,this.skySession.outboundDate)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (result) => {
          this.suggestions = result;
          this.loading = false;
        });
  }
}

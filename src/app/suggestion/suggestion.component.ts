import { Component, ViewChild, ElementRef, NgZone, OnInit, Input } from '@angular/core';
import { FormControl  } from '@angular/forms';
import { MapsAPILoader, AgmMap  } from '@agm/core';

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

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { }

  ngOnInit() {
    if (this.mapLat == null || this.mapLng == null) { // set google maps defaults -> Narni centro geografico Italia
      this.mapLat = 42.5176022;
      this.mapLng = 12.5156299;
    }
    this.searchControl = new FormControl();
    this.setCurrentPosition();
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;

          }
          this.mapLat = place.geometry.location.lat();
          this.mapLng = place.geometry.location.lng();
          this.mapTitle = place.name;
        });
      });
    });
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.mapLat = position.coords.latitude;
        this.mapLng = position.coords.longitude;

      });
    }
  }
}

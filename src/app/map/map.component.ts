import { Component, Input,Output, NgZone, OnInit, EventEmitter } from '@angular/core';
import { MapsAPILoader, AgmMap } from "@agm/core";

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.scss'],
})
export class MapComponent implements OnInit{
  @Input() title: string;
  @Input() lat: number;
  @Input() lng: number;
  @Input() zoom = 5;
  @Input() autocomplete: any;
  @Output() loadComplete = new EventEmitter<string>();

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { 
  }

  ngOnInit() {
    if (this.lat == null || this.lng == null) { // set google maps default location -> Narni centro geografico Italia
      this.lat = 42.5176022;
      this.lng = 12.5156299;
    }
    this.mapsAPILoader.load().then(() => {
      this.setCurrentPosition();
      const autocomplete = new google.maps.places.Autocomplete(this.autocomplete, {
        types: ['(cities)']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.title = place.name;
          this.loadComplete.emit(this.title);
        });
      });
    });
  }

  private setCurrentPosition() {
    let that = this;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        var geocoder = new google.maps.Geocoder();
        var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        geocoder.geocode({'location': geolocate}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var result;
            if (results.length > 1) {
              result = results[1];

            } else {
              result = results[0];

            }
            that.title = result.address_components[2].long_name;
            that.loadComplete.emit(that.title);
          }  
        });    
      });
    }
  }
}

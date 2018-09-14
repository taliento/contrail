import { Component, OnInit } from '@angular/core';
import { SkyScannerService } from "../shared/services";
import { Itinerary} from "../shared/models";
import {Location} from '@angular/common';


@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.scss']
})
export class BookingDetailComponent implements OnInit {

  itinerary: Itinerary;

  constructor(private skyScanner: SkyScannerService,
  private location: Location) {
    this.itinerary = skyScanner.getSelectedItinerary();
  }

  ngOnInit() {

  }

  back() {
      this.location.back();
  }

}

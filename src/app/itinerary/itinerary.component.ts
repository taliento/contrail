import { Component, OnInit, Input } from '@angular/core';
import { Itinerary, Leg } from '../shared/models';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit {

  @Input()
  itinerary: Itinerary;

  @Input()
  inboundLeg: Leg;

  @Input()
  outboundLeg: Leg;

  constructor() { }

  ngOnInit() {
  }

}

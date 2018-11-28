import { Component, OnInit } from '@angular/core';
import { SkyScannerService } from '../shared/services';
import {
  Itinerary,
  Agent,
  PollSessionResult,
  Leg,
  SkySession
} from '../shared/models';
import { Location } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.scss']
})
export class BookingDetailComponent implements OnInit {
  itinerary: Itinerary;
  pollSessionResult: PollSessionResult;
  session: SkySession;

  constructor(
    private skyScanner: SkyScannerService,
    public activeModal: NgbActiveModal,
    private location: Location
  ) {
    this.itinerary = skyScanner.getSelectedItinerary();
    this.session = skyScanner.getCurrentSession();
    this.pollSessionResult = skyScanner.getCachedPollSessionResult();
  }

  ngOnInit() {}

  back() {
    this.skyScanner.removeSelectedItinerary();
    this.activeModal.close();
  }

  getAgent(agent: number): Agent {
    return this.pollSessionResult.Agents.find(x => x.Id === agent);
  }

  findLegById(legId: string): Leg {
    return this.pollSessionResult.Legs.find(x => x.Id === legId);
  }
}

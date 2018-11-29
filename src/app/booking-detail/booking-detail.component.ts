import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Agent,
  Itinerary,
  Leg,
  PollSessionResult,
  SkySession,
} from '../shared/models';
import { SkyScannerService } from '../shared/services';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.scss'],
})
export class BookingDetailComponent implements OnInit {
  itinerary: Itinerary;
  pollSessionResult: PollSessionResult;
  session: SkySession;

  constructor(
    private skyScanner: SkyScannerService,
    public activeModal: NgbActiveModal,
    private location: Location,
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
    return this.pollSessionResult.Agents.find((x) => x.Id === agent);
  }

  findLegById(legId: string): Leg {
    return this.pollSessionResult.Legs.find((x) => x.Id === legId);
  }
}

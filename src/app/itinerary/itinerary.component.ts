import { Component, OnInit, Input } from "@angular/core";
import {
  Itinerary,
  Leg,
  PollSessionResult,
  SkySession
} from "../shared/models";
import { SkyScannerService } from "../shared/services";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { BookingDetailComponent } from "../booking-detail/booking-detail.component";

@Component({
  selector: "app-itinerary",
  templateUrl: "./itinerary.component.html",
  styleUrls: ["./itinerary.component.scss"]
})
export class ItineraryComponent implements OnInit {
  @Input() itinerary: Itinerary;
  session: SkySession;
  pollSessionResult: PollSessionResult;

  constructor(
    private skyScanner: SkyScannerService,
    private router: Router,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private route: ActivatedRoute
  ) {
    this.pollSessionResult = skyScanner.getCachedPollSessionResult();
    this.session = skyScanner.getCurrentSession();
    config.backdrop = "static";
    config.keyboard = false;
  }

  ngOnInit() {}

  findLegById(legId: string): Leg {
    return this.pollSessionResult.Legs.find(x => x.Id == legId);
  }

  goToDetail() {
    this.skyScanner.selectItinerary(this.itinerary);
    const modalRef = this.modalService.open(BookingDetailComponent, {
      size: "lg"
    });
  }
}

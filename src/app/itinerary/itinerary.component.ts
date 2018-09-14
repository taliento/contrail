import { Component, OnInit, Input } from "@angular/core";
import { Itinerary, Leg, PollSessionResult } from "../shared/models";
import { SkyScannerService } from "../shared/services";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-itinerary",
  templateUrl: "./itinerary.component.html",
  styleUrls: ["./itinerary.component.scss"]
})
export class ItineraryComponent implements OnInit {

  @Input() itinerary: Itinerary;

  pollSessionResult: PollSessionResult;

  constructor(private skyScanner: SkyScannerService,
    private router: Router,
    private route: ActivatedRoute) {
    this.pollSessionResult = skyScanner.getCachedPollSessionResult();
  }

  ngOnInit() {}

  findLegById(legId: string): Leg {
    return this.pollSessionResult.Legs.find(x => x.Id == legId);
  }

  goToDetail() {
    this.skyScanner.selectItinerary(this.itinerary);

    this.router.navigate(["../detail"], { relativeTo: this.route });
  }
}

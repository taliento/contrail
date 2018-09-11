import { Component, OnInit, Input } from "@angular/core";
import { Itinerary, Leg, PollSessionResult } from "../shared/models";
import { SkyScannerService } from "../shared/services";

@Component({
  selector: "app-itinerary",
  templateUrl: "./itinerary.component.html",
  styleUrls: ["./itinerary.component.scss"]
})
export class ItineraryComponent implements OnInit {

  @Input() itinerary: Itinerary;

  pollSessionResult: PollSessionResult;

  constructor(private skyScanner: SkyScannerService) {
    this.pollSessionResult = skyScanner.getCachedPollSessionResult();
  }

  ngOnInit() {}

  findLegById(legId: string): Leg {
    return this.pollSessionResult.Legs.find(x => x.Id == legId);
  }
}

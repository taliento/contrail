import { Component, OnInit } from "@angular/core";
import {
  SkySession,
  Itinerary,
  PollSessionResult,
  Leg
} from "../shared/models";
import { SkyScannerService } from "../shared/services";

@Component({
  selector: "app-itineraries",
  templateUrl: "./itineraries.component.html",
  styleUrls: ["./itineraries.component.scss"]
})
export class ItinerariesComponent implements OnInit {
  session: SkySession;
  pollSessionResult: PollSessionResult;
  loading: boolean;

  constructor(private skyScanner: SkyScannerService) {
    this.session = skyScanner.getCurrentSession();
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.skyScanner.pollSessionResults(this.session.sessionkey).subscribe(
      result => {
        this.pollSessionResult = result;
        this.skyScanner.cachePollSessionResults(result);
        this.loading = false;
      },
      error => console.log(error)
    );
  }
}

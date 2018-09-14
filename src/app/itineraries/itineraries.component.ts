import { Component, OnInit } from "@angular/core";
import {
  SkySession,
  Itinerary,
  PollSessionResult,
  PollSession,
  Leg
} from "../shared/models";
import { SkyScannerService } from "../shared/services";
import { FormGroup, Validators, FormControl } from "@angular/forms";

@Component({
  selector: "app-itineraries",
  templateUrl: "./itineraries.component.html",
  styleUrls: ["./itineraries.component.scss"]
})
export class ItinerariesComponent implements OnInit {
  filterForm: FormGroup;
  session: SkySession;
  pollSession: PollSession;
  pollSessionResult: PollSessionResult;
  loading: boolean;

  constructor(private skyScanner: SkyScannerService) {
    this.session = skyScanner.getCurrentSession();
    this.pollSession = new PollSession(this.session.sessionkey, 0);
  }

  ngOnInit() {
    this.filterForm = new FormGroup({
      stops: new FormControl(null, Validators.required)
    });

    this.setDefaults();

    this.load();
  }

  setDefaults() {
    this.filterForm.get("stops").setValue(true);
  }

  load() {
    this.loading = true;

    this.pollSession.stops = this.filterForm.get("stops").value ? 0 : -1;

    this.skyScanner.pollSessionResults(this.pollSession).subscribe(
      result => {
        this.pollSessionResult = result;
        this.skyScanner.cachePollSessionResults(result);
        this.loading = false;
      },
      error => console.log(error)
    );
  }
}

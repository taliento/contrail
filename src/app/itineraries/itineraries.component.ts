import { Component, OnInit } from "@angular/core";
import {
  SkySession,
  Itinerary,
  PollSession,
  Leg
} from "../shared/models";
import { SkyScannerService, AlertService } from "../shared/services";
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
  loading: boolean;

  itinerariesPage: Array<Itinerary>;

  constructor(
    private skyScanner: SkyScannerService,
    private alertService: AlertService
  ) {
    this.session = skyScanner.getCurrentSession();
    this.pollSession = new PollSession(this.session.sessionkey, 0);
  }

  ngOnInit() {
    this.filterForm = new FormGroup({
      stops: new FormControl(null, Validators.required)
    });
    this.setDefaults();
    // this.load();
    this.loadMock();
  }

  setDefaults() {
    this.filterForm.get("stops").setValue(true);
  }

  loadPage($event: number) {
    this.loading = true;
    console.log("load page:"+$event);
    this.itinerariesPage = [];
    const start = (this.pollSession.pageIndex - 1) * (this.pollSession.pageSize);
    const end = start + this.pollSession.pageSize;
    for (let i = start; i < end; i++) {
      if(i >= this.skyScanner.getCachedPollSessionResult().Itineraries.length) {
        break;
      }
      this.itinerariesPage.push(this.skyScanner.getCachedItinerary(i));
    }
    this.loading = false;
  }

  removeItemsPerPage() {
    this.pollSession.pageSize--;
    this.loadPage(this.pollSession.pageIndex);
  }

  addItemsPerPages() {
    this.pollSession.pageSize++;
    this.loadPage(this.pollSession.pageIndex);
  }

  load() {
    this.loading = true;
    this.pollSession.stops = this.filterForm.get("stops").value ? 0 : -1;
    this.skyScanner.pollSessionResults(this.pollSession).subscribe(
      result => {
        this.pollSession.collectionSize = result.Itineraries.length;
        this.skyScanner.cachePollSessionResults(result);
        this.loadPage(this.pollSession.pageIndex);
      },
      error => {
        console.log(error);
        this.alertService.error(error);
      }
    );
  }

  loadMock() {
    this.loading = true;
    let result = this.skyScanner.getMockPollSessionResults();
    this.pollSession.collectionSize = result.Itineraries.length;
    this.skyScanner.cachePollSessionResults(result);
    this.loadPage(this.pollSession.pageIndex);
  }
}

import { Component, OnInit } from "@angular/core";
import { SkySession, Itinerary, PollSession, Leg } from "../shared/models";
import { SkyScannerService, AlertService } from "../shared/services";
import { FormGroup, Validators, FormControl } from "@angular/forms";

const MOCK_SESSION = require("../shared/mock/mockSession.json");
const mockPollSessionResults = require("../shared/mock/pollSessionResult.json");

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
    this.session = MOCK_SESSION; //TESTING

    // this.session = skyScanner.getCurrentSession();
    this.pollSession = new PollSession(this.session.sessionkey, 0);
  }

  ngOnInit() {
    this.filterForm = new FormGroup({
      direct: new FormControl(null),
      oneStop: new FormControl(null),
      stops: new FormControl(null)
    });
    this.setDefaults();
    // this.load();
    this.loadMock(); //TESTING
  }

  setDefaults() {
    this.filterForm.get("direct").setValue(true);
    this.filterForm.get("oneStop").setValue(false);
    this.filterForm.get("stops").setValue(false);
  }

  loadPage($event: number) {
    this.loading = true;
    this.itinerariesPage = [];
    const start = (this.pollSession.pageIndex - 1) * this.pollSession.pageSize;
    const end = start + this.pollSession.pageSize;
    for (let i = start; i < end; i++) {
      if (
        i >= this.skyScanner.getCachedPollSessionResult().Itineraries.length
      ) {
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

    if (this.filterForm.get("stops").value) {
      this.pollSession.stops = -1;
    } else if (this.filterForm.get("oneStop").value) {
      this.pollSession.stops = 1;
    } else {
      this.pollSession.stops = 0;
    }

    this.skyScanner.pollSessionResults(this.pollSession).subscribe(
      result => {
        this.pollSession.collectionSize = result.Itineraries.length;
        this.skyScanner.cachePollSessionResults(result);
        this.loadPage(this.pollSession.pageIndex);
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  loadMock() {
    this.loading = true;
    let result = mockPollSessionResults;
    this.pollSession.collectionSize = result.Itineraries.length;
    this.skyScanner.cachePollSessionResults(result);
    this.loadPage(this.pollSession.pageIndex);
  }
}

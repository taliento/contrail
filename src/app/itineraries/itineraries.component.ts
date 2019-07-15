import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Itinerary, Leg, PollSession, SkySession } from '../shared/models';
import { AlertService, SkyScannerService } from '../shared/services';
// const mockPollSessionResults = require("../shared/mock/pollSessionResult.json");
// const MOCK_SESSION = require("../shared/mock/mockSession.json");

@Component({
  selector: 'app-itineraries',
  templateUrl: './itineraries.component.html',
  styleUrls: ['./itineraries.component.scss'],
})
export class ItinerariesComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  session: SkySession;
  pollSession: PollSession;
  loading: boolean;
  itinerariesPage: Itinerary[];
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private skyScanner: SkyScannerService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    // this.session = MOCK_SESSION; //TESTING

    this.session = skyScanner.getCurrentSession();
    this.pollSession = new PollSession(this.session.sessionkey, 0);
  }

  ngOnInit() {
    this.filterForm = new FormGroup({
      direct: new FormControl(null),
      oneStop: new FormControl(null),
      stops: new FormControl(null),
    });
    this.setDefaults();
    this.load();
    // this.loadMock(); //TESTING
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  setDefaults() {
    this.filterForm.get('direct').setValue(true);
    this.filterForm.get('oneStop').setValue(false);
    this.filterForm.get('stops').setValue(false);
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

    if (this.filterForm.get('stops').value) {
      this.pollSession.stops = -1;
    } else if (this.filterForm.get('oneStop').value) {
      this.pollSession.stops = 1;
    } else {
      this.pollSession.stops = 0;
    }

    this.skyScanner.pollSessionResults(this.pollSession)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (result) => {
          this.pollSession.collectionSize = result.Itineraries.length;
          this.skyScanner.cachePollSessionResults(result);
          this.loadPage(this.pollSession.pageIndex);
        },
        (error) => {
          // this.router.navigate(['../session'], { relativeTo: this.route  });
          this.alertService.error(JSON.stringify(error));
        },
      );
  }

  // loadMock() {
  //   this.loading = true;
  //   let result = mockPollSessionResults;
  //   this.pollSession.collectionSize = result.Itineraries.length;
  //   this.skyScanner.cachePollSessionResults(result);
  //   this.loadPage(this.pollSession.pageIndex);
  // }
}

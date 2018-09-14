import { Component, OnInit, Input } from '@angular/core';
import { Leg, PollSessionResult, PollResultPlace, Carrier } from '../shared/models';
import { SkyScannerService } from "../shared/services";

@Component({
  selector: 'app-leg',
  templateUrl: './leg.component.html',
  styleUrls: ['./leg.component.scss']
})
export class LegComponent implements OnInit {

  @Input()
  leg: Leg;

  pollSessionResult: PollSessionResult;

  constructor(private skyScanner: SkyScannerService) {
    this.pollSessionResult = skyScanner.getCachedPollSessionResult();
  }

  ngOnInit() {
  }

  getPlace(id: number): PollResultPlace {
    return this.pollSessionResult.Places.find(x => x.Id === id);
  }

  getCarrier(id: number): Carrier {
    return this.pollSessionResult.Carriers.find(x => x.Id === id);
  }

}

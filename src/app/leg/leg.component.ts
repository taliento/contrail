import { Component, OnInit, Input } from '@angular/core';
import { Leg, PollSessionResult } from '../shared/models';
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

}

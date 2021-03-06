import { Component, OnInit } from '@angular/core';
import { SkySession } from '../shared/models';
import { SkyScannerService } from '../shared/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  session: SkySession;

  constructor(private skyScanner: SkyScannerService) {
    this.session = new SkySession(null);
    this.skyScanner.setCurrentSession(this.session);
  }

  ngOnInit() {}
}

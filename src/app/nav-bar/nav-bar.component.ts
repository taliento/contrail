import { Component, OnInit } from "@angular/core";
import { SkyScannerService } from "../shared/services";
import { SkySession } from "../shared/models";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"]
})
export class NavBarComponent implements OnInit {

  session: SkySession;

  constructor(private skyScanner: SkyScannerService) {
    this.session = skyScanner.getCurrentSession();
  }

  ngOnInit() {}

  getLocale() {
    return this.session.locale+"-"+ this.session.country + " " + this.session.currency;
  }
}

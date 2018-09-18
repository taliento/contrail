import { Component, OnInit } from "@angular/core";
import { debounceTime } from "rxjs/operators";
import { AlertService } from "../shared/services";

@Component({
  moduleId: module.id,
  selector: "app-alert",
  templateUrl: "alert.component.html"
})
export class AlertComponent implements OnInit {
  message: any;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService
      .getMessage()
      .subscribe(message => (this.message = message));
    debounceTime.call(
      this.alertService.getMessage().subscribe(() => (this.message = null)),
      5000
    );
  }
}

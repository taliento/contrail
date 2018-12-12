import { Component, OnInit, OnDestroy } from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AlertService } from '../shared/services';
import { Subject } from 'rxjs';


@Component({
  moduleId: module.id,
  selector: 'app-alert',
  templateUrl: 'alert.component.html',
})
export class AlertComponent implements OnInit, OnDestroy {
  message: any;
  private unsubscribe: Subject<void> = new Subject();

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService
    .getMessage()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((message) => this.message = message);

    this.alertService.getMessage().pipe(
      debounceTime(5000),
    ).subscribe(() => this.message = null);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}

import { OnDestroy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SkySession, User } from '../shared/models';
import { SkyScannerService, UserService } from '../shared/services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  session: SkySession;
  user: User;
  navbarOpen = false;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private skyScanner: SkyScannerService,
    private userService: UserService,
    private router: Router,
  ) {
    this.session = skyScanner.getCurrentSession();
  }

  ngOnInit() {
    this.userService.userValue
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((nextValue) => {
      this.user = nextValue;
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getLocale() {
    return (
      this.session.locale +
      '-' +
      this.session.country +
      ' ' +
      this.session.currency
    );
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['#']);
  }
}

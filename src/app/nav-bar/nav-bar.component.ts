import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SkySession, User } from '../shared/models';
import { SkyScannerService, UserService } from '../shared/services';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  session: SkySession;
  user: User;
  navbarOpen = false;

  constructor(
    private skyScanner: SkyScannerService,
    private userService: UserService,
    private router: Router,
  ) {
    this.session = skyScanner.getCurrentSession();
  }

  ngOnInit() {
    this.userService.userValue.subscribe((nextValue) => {
      this.user = nextValue;
    });
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

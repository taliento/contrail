import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/models';
import { AlertService, UserService } from '../shared/services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  user: User;
  loading = false;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private userService: UserService,
    private router: Router,
    private alert: AlertService,
  ) {}

  ngOnInit() {
    this.user = new User();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  signin() {
    this.loading = true;
    this.userService.signin(this.user)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(
      (result) => {
        this.loading = false;
        this.router.navigate(['/home/session']);
      },
      (error) => {
        this.alert.error(error);
      },
    );
  }
}

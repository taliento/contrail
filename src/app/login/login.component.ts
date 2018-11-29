import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/models';
import { AlertService, UserService } from '../shared/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: User;
  loading = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private alert: AlertService,
  ) {}

  ngOnInit() {
    this.user = new User();
  }

  signin() {
    this.loading = true;
    this.userService.signin(this.user).subscribe(
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

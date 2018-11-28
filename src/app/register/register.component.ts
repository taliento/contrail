import { Component, OnInit } from '@angular/core';
import { UserService, AlertService } from '../shared/services';
import { User } from '../shared/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: User;
  loading = false;
  constructor(
    private userService: UserService,
    private router: Router,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.user = new User();
  }

  signup() {
    this.loading = true;
    this.userService.signup(this.user).subscribe(
      result => {
        this.loading = true;
        this.router.navigate(['/home/session']);
      },
      error => {
        this.alert.error(error);
      }
    );
  }
}

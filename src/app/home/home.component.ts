import { Component, OnInit } from '@angular/core';
import { SkyScannerService } from '../shared/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  success: any;
  loading: boolean = false;

  constructor(private skyScanner: SkyScannerService) { }

  ngOnInit() {
  }

  createSession() {
    this.loading = true;
    this.skyScanner.createSession()
    .subscribe(result => {
      console.log(result);
      this.loading = false;
      this.success = result;
    },
    error => {
      this.loading = false;
      console.log(error);
    });
  }

}

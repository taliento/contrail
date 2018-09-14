import { Component, OnInit, Input } from '@angular/core';
import { Carrier } from '../shared/models';

@Component({
  selector: 'app-carrier',
  templateUrl: './carrier.component.html',
  styleUrls: ['./carrier.component.scss']
})
export class CarrierComponent implements OnInit {

  @Input()
  carrier: Carrier;

  constructor() { }

  ngOnInit() {
  }

}

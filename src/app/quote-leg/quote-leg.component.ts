import { Component, OnInit, Input } from '@angular/core';
import { Quote } from '../shared/models';

@Component({
  selector: 'app-quote-leg',
  templateUrl: './quote-leg.component.html',
  styleUrls: ['./quote-leg.component.scss']
})
export class QuoteLegComponent implements OnInit {
  @Input() quote: Quote;

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { PollResultPlace } from '../shared/models';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent implements OnInit {
  @Input() place: PollResultPlace;

  @Input() badgeClass: string;

  constructor() {}

  ngOnInit() {}
}

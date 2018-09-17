import { Component, OnInit, Input } from '@angular/core';
import { Agent } from '../shared/models';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {

  @Input()
  agent: Agent;

  constructor() { }

  ngOnInit() {
  }

}

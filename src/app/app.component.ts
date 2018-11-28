import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
constructor() {
const title = 'hello';
const split = title.split(' ');
}
}

import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapComponent } from './map.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    AgmCoreModule.forRoot({
    apiKey: environment.googleApiKey,
    libraries: ['places'],
    language: 'it-IT'
    })
  ],
  declarations: [ MapComponent ],
  exports: [ MapComponent ]
})
export class MapModule {}

import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
import { MapComponent } from './map.component';

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    AgmCoreModule.forRoot({
    apiKey: environment.googleApiKey,
    libraries: ['places'],
    language: 'it-IT',
    }),
  ],
  declarations: [ MapComponent ],
  exports: [ MapComponent ],
})
export class MapModule {}

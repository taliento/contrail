import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserListComponent } from './user-list/user-list.component';
import { HomeComponent } from './home/home.component';
import { routing } from './app.routing';

import { SkyScannerService } from './shared/services';
import { ItinerariesComponent } from './itineraries/itineraries.component';
import { ItineraryComponent } from './itinerary/itinerary.component';

@NgModule({
  declarations: [
    AppComponent,
    UserDetailsComponent,
    UserListComponent,
    HomeComponent,
    ItinerariesComponent,
    ItineraryComponent
  ],
  imports: [
    routing,
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    SkyScannerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

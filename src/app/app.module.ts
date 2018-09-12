import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
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
import { LegComponent } from './leg/leg.component';
import { SessionComponent } from './session/session.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';

import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';

registerLocaleData(localeIt);

@NgModule({
  declarations: [
    AppComponent,
    UserDetailsComponent,
    UserListComponent,
    HomeComponent,
    ItinerariesComponent,
    ItineraryComponent,
    LegComponent,
    SessionComponent,
    NavBarComponent,
    FooterComponent
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
    SkyScannerService,
    { provide: LOCALE_ID, useValue: 'it' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

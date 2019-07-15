import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgentComponent } from './agent/agent.component';
import { AlertComponent } from './alert/alert.component';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { CarrierComponent } from './carrier/carrier.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { ItinerariesComponent } from './itineraries/itineraries.component';
import { ItineraryComponent } from './itinerary/itinerary.component';
import { LegComponent } from './leg/leg.component';
import { LoginComponent } from './login/login.component';
import { MapModule  } from './map/map.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { PlaceComponent } from './place/place.component';
import { QuoteLegComponent } from './quote-leg/quote-leg.component';
import { QuoteComponent } from './quote/quote.component';
import { RegisterComponent } from './register/register.component';
import { SessionComponent } from './session/session.component';
import { HoursMinutesPipe } from './shared/pipes';
import { AlertService, SkyScannerService , UserService } from './shared/services';
import { SuggestionDetailComponent } from './suggestion-detail/suggestion-detail.component';
import { SuggestionComponent } from './suggestion/suggestion.component';

registerLocaleData(localeIt);

@NgModule({
  declarations: [
  AppComponent,
  HomeComponent,
  ItinerariesComponent,
  ItineraryComponent,
  LegComponent,
  SessionComponent,
  NavBarComponent,
  FooterComponent,
  HoursMinutesPipe,
  PlaceComponent,
  CarrierComponent,
  BookingDetailComponent,
  AgentComponent,
  AlertComponent,
  LoginComponent,
  RegisterComponent,
  SuggestionComponent,
  SuggestionDetailComponent,
  QuoteComponent,
  QuoteLegComponent,
  ],
  imports: [
  routing,
  CommonModule,
  BrowserModule,
  FormsModule,
  HttpClientModule,
  ReactiveFormsModule,
  NgbModule,
  MapModule,
  ],
  providers: [
  SkyScannerService,
  UserService,
  AlertService,
  { provide: LOCALE_ID, useValue: 'it' },
  ],
  entryComponents: [BookingDetailComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

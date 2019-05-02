import { RouterModule, Routes } from '@angular/router';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { HomeComponent } from './home/home.component';
import { ItinerariesComponent } from './itineraries/itineraries.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SessionComponent } from './session/session.component';
import { SuggestionComponent } from './suggestion/suggestion.component';

const appRoutes: Routes = [
  {
    path: 'signin',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'session',
        component: SessionComponent,
      },
      {
        path: 'itineraries',
        component: ItinerariesComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home/session',
  },
];

export const routing = RouterModule.forRoot(appRoutes);

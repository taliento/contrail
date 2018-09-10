import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ItinerariesComponent } from './itineraries/itineraries.component';

const appRoutes: Routes = [
  {
    path: 'itineraries',
    component: ItinerariesComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

export const routing = RouterModule.forRoot(appRoutes);

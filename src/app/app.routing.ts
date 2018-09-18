import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ItinerariesComponent } from "./itineraries/itineraries.component";
import { SessionComponent } from "./session/session.component";
import { BookingDetailComponent } from "./booking-detail/booking-detail.component";

const appRoutes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    children: [
      {
        path: "session",
        component: SessionComponent
      },
      {
        path: "itineraries",
        component: ItinerariesComponent
      }
    ]
  },
  {
    path: "**",
    redirectTo: "home/session"
  }
];

export const routing = RouterModule.forRoot(appRoutes);

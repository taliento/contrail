import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserListComponent } from './user-list/user-list.component';
import { HomeComponent } from './home/home.component';
import { routing } from './app.routing';

import { SkyScannerService } from './shared/services'

@NgModule({
  declarations: [
    AppComponent,
    UserDetailsComponent,
    UserListComponent,
    HomeComponent
  ],
  imports: [
    routing,
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    SkyScannerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

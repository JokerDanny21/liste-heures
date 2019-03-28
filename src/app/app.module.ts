import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from './shared/material.module';
import { HomeComponent } from './home/home.component';
import { HoursListComponent } from './hours-list/hours-list.component';
import { ListDetailComponent } from './hours-list/list-detail/list-detail.component';
import { ListEditComponent } from './hours-list/list-edit/list-edit.component';
import { HLService } from './hours-list/hours-list.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateSelectorComponent } from './hours-list/list-edit/date-selector/date-selector';
import { MAT_DATE_LOCALE } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    HoursListComponent,
    ListDetailComponent,
    ListEditComponent,
    DateSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [HLService, { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WelcomeComponent } from './welcome/welcome.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './admin/admin.component';
import { CatererComponent } from './caterer/caterer.component';
import { WorkerComponent } from './worker/worker.component';
import { AddworkerComponent } from './addworker/addworker.component';
import {MatStepperModule} from '@angular/material/stepper';
import { AddcatererComponent } from './addcaterer/addcaterer.component';
import { ShowobjectComponent } from './showobject/showobject.component';
import { NgImageSliderModule } from 'ng-image-slider';


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    AdminComponent,
    CatererComponent,
    WorkerComponent,
    AddworkerComponent,
    AddcatererComponent,
    ShowobjectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    BrowserAnimationsModule , 
    FlexLayoutModule ,
    AngularMaterialModule , 
    HttpClientModule ,
    MatStepperModule , 
    NgImageSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

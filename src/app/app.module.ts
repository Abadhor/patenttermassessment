import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AccordionModule } from 'ng2-bootstrap';

import { AppComponent } from './app.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { PatentTermsService } from './patent-terms.service';
import { UserService } from './user.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    AssessmentComponent,
    DashboardComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AccordionModule.forRoot(),
    AppRoutingModule
  ],
  providers: [PatentTermsService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }

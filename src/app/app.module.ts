import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AccordionModule } from 'ng2-bootstrap';

import { AppComponent } from './app.component';
import { AssessmentComponent } from './assessment/assessment.component';

import { PatentTermsService } from './patent-terms.service';
import { PatentTextService } from './patent-text.service';
import { UserService } from './user.service';
import { AuthGuardService } from './auth-guard.service';
import { AssessmentGuardService } from './assessment-guard.service';
import { AssessmentService } from './assessment.service';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SafePipe } from './safe.pipe';
import { GuideComponent } from './guide/guide.component';
import { PatentTextComponent } from './patent-text/patent-text.component';

@NgModule({
  declarations: [
    AppComponent,
    AssessmentComponent,
    DashboardComponent,
    LoginComponent,
    SafePipe,
    GuideComponent,
    PatentTextComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AccordionModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    PatentTermsService,
    PatentTextService,
    UserService,
    AuthGuardService,
    AssessmentGuardService,
    AssessmentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

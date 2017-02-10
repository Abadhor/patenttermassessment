import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { PatentTermsService } from './patent-terms.service';

@NgModule({
  declarations: [
    AppComponent,
    AssessmentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [PatentTermsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

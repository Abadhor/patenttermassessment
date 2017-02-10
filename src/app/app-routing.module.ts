import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssessmentComponent } from './assessment/assessment.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'assessment',
    pathMatch: 'full'
  },
  {
    path: 'assessment',
    component: AssessmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }

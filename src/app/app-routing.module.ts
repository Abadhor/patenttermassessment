import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssessmentComponent } from './assessment/assessment.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { GuideComponent } from './guide/guide.component';
import { AuthGuardService } from './auth-guard.service';
import { AssessmentGuardService } from './assessment-guard.service';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'assessment/:id',
    canActivate: [AuthGuardService, AssessmentGuardService],
    component: AssessmentComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuardService],
    component: DashboardComponent
  },
  {
    path: 'guide',
    canActivate: [AuthGuardService],
    component: GuideComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }

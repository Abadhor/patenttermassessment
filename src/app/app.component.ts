import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  
  constructor(private router: Router) { }
  
  isNavbarActive() {
    return sessionStorage.getItem('currentUser');
  }
  
  isAssessmentSelected() {
    return sessionStorage.getItem('selectedAssessment');
  }
  
  navAssessment() {
    this.router.navigate(['/assessment', sessionStorage.getItem('selectedAssessment')]);
  }
  
  onLogout() {
    if (sessionStorage.getItem('currentUser')) {
      sessionStorage.removeItem('currentUser');
      this.router.navigate(['']);
    }
  }
}

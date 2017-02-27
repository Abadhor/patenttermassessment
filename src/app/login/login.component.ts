import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../user.service';
import 'rxjs/add/operator/switchMap';

import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  domainsPrimary =  ['all'];
  domainsOther = ['none'];
  
  loginForm = new User();
  
  registerForm = new User();

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    //this.registerForm.domains = {};
    this.userService.getDomains().subscribe(domains => {
      for (let domain of domains) {
        this.domainsPrimary.push(domain.name);
        this.domainsOther.push(domain.name);
      }
    });
  }
  
  diagnostic: any;
  loginDiagnostic: any;
  
  onRegister() {
    this.diagnostic = "Registering...";
    this.userService.registerUser(this.registerForm)
      .subscribe(user => {
        this.diagnostic = JSON.stringify(user);
        this.diagnostic = "Registration Complete";
      },
      error => {this.diagnostic = "Email already registered."});
  }
  
  onLogin() {
    this.userService.loginUser(this.loginForm)
      .subscribe(user => {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.loginDiagnostic = "Login with ID " + JSON.parse(sessionStorage.getItem('currentUser'))['_id'];
        //console.log(sessionStorage.getItem('currentUser'));
        this.router.navigate(['dashboard']);
      },
      error => {this.loginDiagnostic = "Email not registered."});
  }
  
  onLogout() {
    if (sessionStorage.getItem('currentUser')) {
      sessionStorage.removeItem('currentUser');
      this.loginDiagnostic = "Logout Complete";
    } else {
      this.loginDiagnostic = "Not logged in";
    }
  }
  
  /*
  checkboxOnClick(domain: string) {
    if (domain in this.registerForm.domains) {
      delete this.registerForm.domains[domain];
    } else {
      this.registerForm.domains[domain] = 1;
    }
  }
  */
  
  //get diagnostic() { return JSON.stringify(this.registerForm); }

}

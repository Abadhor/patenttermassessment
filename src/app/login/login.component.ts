import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  domains =  ['a','b','c','d','e'];
  
  loginForm = new User();
  
  registerForm = new User();

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.registerForm.domains = {};
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
        this.loginDiagnostic = JSON.stringify(user);
        this.loginDiagnostic = "Login Complete";
      },
      error => {this.loginDiagnostic = "Email not registered."});
  }
  
  checkboxOnClick(domain: string) {
    if (domain in this.registerForm.domains) {
      delete this.registerForm.domains[domain];
    } else {
      this.registerForm.domains[domain] = 1;
    }
  }
  
  //get diagnostic() { return JSON.stringify(this.registerForm); }

}

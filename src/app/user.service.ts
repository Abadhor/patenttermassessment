import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(private http: Http) { }
  
  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/api/user/register', JSON.stringify(user), {headers: headers})
      .map(res => res.json());
  }
  
  loginUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/api/user/login', JSON.stringify(user), {headers: headers})
      .map(res => res.json());
  }
  
  getDomains() {
    return this.http.get('/api/domains')
      .map(res => res.json());
  }

}

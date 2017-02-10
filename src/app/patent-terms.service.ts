import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PatentTermsService {

  constructor(private http: Http) { }
  
  // Get all patent term candidates from the API
  getAllPatentTerms() {
    return this.http.get('/api/patents')
      .map(res => res.json());
  }
  
  getPatent(id: string) {
    console.log('/api/patent/'+id);
    return this.http.get('/api/patent/'+id)
      .map(res => res.json());
  }

}

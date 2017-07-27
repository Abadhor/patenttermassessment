import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PatentTextService {

  constructor(private http: Http) { }

  getText(ucid: string) {
    return this.http.get('/api/pdf-texts/'+ucid)
      .map(res => res.json());
  }
  
}

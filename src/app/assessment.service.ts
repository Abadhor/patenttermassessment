import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class AssessmentService {

  constructor(private http: Http) { }
  
  
  getAssessments(id: string) {
    //console.log('/api/assessments/user/'+id);
    return this.http.get('/api/assessments/user/'+id)
      .map(res => res.json());
  }

}

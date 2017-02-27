import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class AssessmentService {

  constructor(private http: Http) { }
  
  
  getAssessments(id: string) {
    //console.log('/api/assessments/user/'+id);
    return this.http.get('/api/assessments/user/'+id)
      .map(res => res.json());
  }
  
  getAssessment(userAndPatent) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/api/assessments', JSON.stringify(userAndPatent), {headers: headers})
      .map(res => res.json());
  }
  
  updateAssessment(assessment) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('/api/assessments', JSON.stringify(assessment), {headers: headers})
      .map(res => res.json());
  }

}

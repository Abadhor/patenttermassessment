import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../assessment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  assessments: any[] = [];
  selectedAssessment: any;

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit() {
    let user = JSON.parse(sessionStorage.getItem('currentUser'));
    this.assessmentService.getAssessments(user._id).subscribe(assessments => {
      this.assessments = assessments;
    });
  }
  
  onSelect(assessment: any) {
    this.selectedAssessment = assessment;
  }

}

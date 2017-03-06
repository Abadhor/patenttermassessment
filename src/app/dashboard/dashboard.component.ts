import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../assessment.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  assessments: any[] = [];
  selectedAssessment: any;

  constructor(private router: Router, private assessmentService: AssessmentService) { }

  ngOnInit() {
    let user = JSON.parse(sessionStorage.getItem('currentUser'));
    this.assessmentService.getAssessments(user._id).subscribe(assessments => {
      this.assessments = assessments;
    });
  }
  
  onSelect(assessment: any) {
    this.selectedAssessment = assessment;
    sessionStorage.setItem('selectedAssessment', this.selectedAssessment.patent);
  }
  
  onAssess() {
    this.router.navigate(['/assessment', this.selectedAssessment.patent]);
  }

}

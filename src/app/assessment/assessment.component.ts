import { Component, OnInit } from '@angular/core';
import { PatentTermsService } from '../patent-terms.service';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit {

  patentID: string;
  patents: any[] = [];
  term_candidates: any[];
  related_terms: any[] = [];
  
  selectedCandidate: any;
  selectedRelatedTerm: any;

  constructor(private patentTermsService: PatentTermsService) { }

  ngOnInit() {
    this.patentID = '589a0a2ec216a0209ccf2f85';
    // Retrieve posts from the API
    this.patentTermsService.getPatent(this.patentID).subscribe(patents => {
      this.term_candidates = patents[0].term_candidates;
    });
  }
  
  onSelectCandidate(candidate: any) {
    this.selectedCandidate = candidate;
    this.related_terms = this.selectedCandidate.related_terms;
  }
  
  onSelectRelated(related: any) {
    this.selectedRelatedTerm = related;
  }

}

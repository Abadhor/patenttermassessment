import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PatentTermsService } from '../patent-terms.service';
import { AssessmentService } from '../assessment.service';
import { PatentTextService } from '../patent-text.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit {

  
  patent: any;
  patentText: any;
  assessment: any;
  term_candidates: any[] = [];
  related_terms: any[] = [];
  
  selectedCandidate: any;
  selectedRelatedTerm: any;
  
  DOMAIN: string = "http://localhost:3000"
  ucid: string;
  pdfURL: string;
  displayMode: string = "pdf";

  constructor(private route: ActivatedRoute,
              private router: Router,
              private patentTermsService: PatentTermsService,
              private patentTextService: PatentTextService,
              private assessmentService: AssessmentService) { }

  ngOnInit() {
    // Retrieve posts from the API
    this.route.params.switchMap((params: Params) => 
      this.patentTermsService.getPatent(params['id'])).subscribe(patent => {
        this.patent = patent[0];
        this.term_candidates = this.patent.term_candidates;
        this.ucid = this.patent.ucid;
        this.pdfURL = this.DOMAIN+"/api/pdfs/"+this.ucid;
        console.log(this.pdfURL);
        //console.log(JSON.stringify(this.term_candidates));
        let user = JSON.parse(sessionStorage.getItem('currentUser'));
        this.assessmentService.getAssessment({user:user._id, patent:this.patent._id}).subscribe(assessment => {
          this.assessment = assessment[0];
          //console.log(JSON.stringify(this.assessment.term_candidates));
        });
        this.patentTextService.getText(this.ucid).subscribe(patentText => {
          this.patentText = patentText;
          //console.log(JSON.stringify(patentText));
        });
      });
  }
  
  getAssessmentTermCandidate(term_candidate: any) {
    let t_id = term_candidate.id;
    let t_assessment = this.assessment.term_candidates[t_id];
    if (t_assessment.id != term_candidate.id) {
      throw new Error("Patent / Assessment Term Candidate ID mismatch");
    }
    return t_assessment;
  }
  
  getAssessmentRelatedTerm(term_candidate: any, related_term: any) {
    let t_id = term_candidate.id;
    let r_id = related_term.id;
    let t_assessment = this.assessment.term_candidates[t_id];
    let r_assessment = t_assessment.related_terms[r_id];
    if (t_assessment.id != term_candidate.id) {
      throw new Error("Patent / Assessment Term Candidate ID mismatch");
    }
    if (r_assessment.id != related_term.id) {
      throw new Error("Patent / Assessment Related Term ID mismatch");
    }
    return r_assessment;
  }
  
  getSearchQuality(term_candidate: any) {
    return this.getAssessmentTermCandidate(term_candidate).search_quality;
  }
  
  getRelationship(term_candidate: any, related_term: any) {
    return this.getAssessmentRelatedTerm(term_candidate, related_term).relationship;
  }
  
  isAssessedTermCandidate(term_candidate: any) {
    if (this.getSearchQuality(term_candidate) != -1) {
      return "panel-success"
    } else {
      return "";
    }
  }
  
  isAssessedRelatedTerm(term_candidate: any, related_term: any) {
    if (this.getRelationship(term_candidate, related_term) != -1) {
      return "panel-success"
    } else {
      return "";
    }
  }
  
  onSelectCandidate(candidate: any) {
    this.selectedCandidate = candidate;
    this.related_terms = this.selectedCandidate.related_terms;
    this.selectedRelatedTerm = undefined;
  }
  
  onSelectRelated(related: any) {
    this.selectedRelatedTerm = related;
  }
  
  
  onSelectSearchQuality(term_candidate: any, quality: number){
    let t_assessment = this.getAssessmentTermCandidate(term_candidate);
    if (t_assessment.search_quality == -1) {
      this.assessment.current_selections += 1;
    }
    t_assessment.search_quality = quality;
    //console.log(JSON.stringify(this.assessment));
    this.assessmentService.updateAssessment(this.assessment).subscribe(assessment => {
      //this.assessment = assessment[0];
      //console.log(JSON.stringify(assessment));
    });
  }
  
  onSelectRelationship(term_candidate: any, related_term: any, quality: number){
    let r_assessment = this.getAssessmentRelatedTerm(term_candidate ,related_term);
    if (r_assessment.relationship == -1) {
      this.assessment.current_selections += 1;
    }
    r_assessment.relationship = quality;
    this.assessmentService.updateAssessment(this.assessment).subscribe(assessment => {

    });
  }
  
  onSelectMode(mode: string) {
    this.displayMode = mode;
  }
  
  compareIds(a, b) {
    return a.id - b.id;
  }

}

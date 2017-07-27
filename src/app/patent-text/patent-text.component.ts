import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-patent-text',
  templateUrl: './patent-text.component.html',
  styleUrls: ['./patent-text.component.css']
})
export class PatentTextComponent implements OnInit, OnChanges {

  displayText: string;
  displayTitle: string;
  displayAbstract: string;
  displayClaim: string;
  displayDescription: string;
  

  constructor() { }

  ngOnInit() {
  }
  
  @Input() text: any;
  @Input() termCandidate: any;
  @Input() relatedTerm: any;
  
  ngOnChanges(changes: SimpleChanges) {
    this.displayTitle = this.highlightSearchTerms(this.text.title);
    this.displayAbstract = this.highlightSearchTerms(this.text['abstract']);
    this.displayClaim = this.highlightSearchTerms(this.text.claim);
    this.displayDescription = this.highlightSearchTerms(this.text.description);
    
    this.displayText = "abc";
    if (this.relatedTerm && this.relatedTerm.name.includes(this.termCandidate.name)) {
      let r = new RegExp('('+this.relatedTerm.name+')', 'gi');
      this.displayText = this.displayText.replace(r, `<span class="big-font"><span class="label label-success">$1</span></span>`);
      let t = new RegExp('('+this.termCandidate.name+')', 'gi');
      this.displayText = this.displayText.replace(t, `<span class="big-font"><span class="label label-primary">$1</span></span>`);
      return;
    }
    if (this.termCandidate){
      let t = new RegExp('('+this.termCandidate.name+')', 'gi');
      this.displayText = this.displayText.replace(t, `<span class="big-font"><span class="label label-primary">$1</span></span>`);
    }
    if (this.relatedTerm){
      let r = new RegExp('('+this.relatedTerm.name+')', 'gi');
      this.displayText = this.displayText.replace(r, `<span class="big-font"><span class="label label-success">$1</span></span>`);
    }
  }
  
  highlightSearchTerms(text: string) {
    let retText = text;
    if (this.relatedTerm && this.relatedTerm.name.includes(this.termCandidate.name)) {
      let r = new RegExp('('+this.relatedTerm.name+')', 'gi');
      retText = retText.replace(r, `<span class="big-font"><span class="label label-success">$1</span></span>`);
      let t = new RegExp('('+this.termCandidate.name+')', 'gi');
      retText = retText.replace(t, `<span class="big-font"><span class="label label-primary">$1</span></span>`);
      return retText;
    }
    if (this.termCandidate){
      let t = new RegExp('('+this.termCandidate.name+')', 'gi');
      retText = retText.replace(t, `<span class="big-font"><span class="label label-primary">$1</span></span>`);
    }
    if (this.relatedTerm){
      let r = new RegExp('('+this.relatedTerm.name+')', 'gi');
      retText = retText.replace(r, `<span class="big-font"><span class="label label-success">$1</span></span>`);
    }
    return retText;
  }

}

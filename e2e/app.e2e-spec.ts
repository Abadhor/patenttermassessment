import { PatentTermAssessmentPage } from './app.po';

describe('patent-term-assessment App', function() {
  let page: PatentTermAssessmentPage;

  beforeEach(() => {
    page = new PatentTermAssessmentPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

import { browser, by, element, ElementFinder, ElementArrayFinder } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('h1')).getText() as Promise<string>;
  }

  getMainHeading(): Promise<string> {
    return element(by.css('h1')).getText() as Promise<string>;
  }

  // Tab Navigation
  getDemoTabButton() {
    return element(by.css('.tab-button:first-child'));
  }

  getGuideTabButton() {
    return element(by.css('.tab-button:last-child'));
  }

  getActiveTab(): Promise<string> {
    return element(by.css('.tab-button.active')).getText() as Promise<string>;
  }

  clickDemoTab() {
    return this.getDemoTabButton().click();
  }

  clickGuideTab() {
    return this.getGuideTabButton().click();
  }

  // Tab Content
  getDemoTabContent() {
    return element(by.css('.tab-content:not(.guide-content)'));
  }

  getGuideTabContent() {
    return element(by.css('.tab-content.guide-content'));
  }

  // Guide Content Elements
  getGuideSection() {
    return element(by.css('.guide-section'));
  }

  getGuideIntro() {
    return element(by.css('.guide-intro'));
  }

  getGuideSubsections() {
    return element.all(by.css('.guide-subsection'));
  }

  getCodeBlocks() {
    return element.all(by.css('.code-block'));
  }

  getPropertyTables() {
    return element.all(by.css('.property-table'));
  }

  getExampleCards() {
    return element.all(by.css('.example-card'));
  }

  getBestPractices() {
    return element.all(by.css('.practice-item'));
  }

  getTroubleshootingSection() {
    return element(by.css('.troubleshooting'));
  }

  getApiReference() {
    return element(by.css('.api-reference'));
  }

  getDemoSections() {
    return element.all(by.css('.demo-section'));
  }

  getDemoCards() {
    return element.all(by.css('.demo-card'));
  }

  getDemoGrid() {
    return element(by.css('.demo-grid'));
  }

  // Basic Demos
  getSingleSelectDemo() {
    return element(by.css('[placeholder="Select an option"]'));
  }

  getMultipleSelectDemo() {
    return element(by.css('[placeholder="Select multiple options"]'));
  }

  getConfirmationSelectDemo() {
    return element(by.css('[placeholder="Select with confirmation"]'));
  }

  getRequiredSelectDemo() {
    return element(by.css('[placeholder="Required field"]'));
  }

  // Configuration Object Demos
  getConfigSingleSelectDemo() {
    return element(by.css('[placeholder="Select an option"]'));
  }

  getConfigMultipleSelectDemo() {
    return element(by.css('[placeholder="Select multiple options"]'));
  }

  getMixedConfigSelectDemo() {
    return element(by.css('[placeholder="Mixed configuration"]'));
  }

  getInvalidMixedSelectDemo() {
    return element(by.css('[placeholder="Invalid mixed configuration"]'));
  }

  // Search Functionality Demos
  getSearchableSingleDemo() {
    return element(by.css('[placeholder="Searchable single select"]'));
  }

  getSearchableMultipleDemo() {
    return element(by.css('[placeholder="Searchable multiple select"]'));
  }

  getSearchMinLengthDemo() {
    return element(by.css('[placeholder="Search with minimum length"]'));
  }

  getSearchableConfirmationDemo() {
    return element(by.css('[placeholder="Searchable with confirmation"]'));
  }

  getSearchInput() {
    return element(by.css('.nxt-dropdown-search input'));
  }

  getFilteredOptions() {
    return element.all(by.css('.nxt-dropdown-option'));
  }

  // Advanced Demos
  getLargeDatasetSelectDemo() {
    return element(by.css('[placeholder="Select from 50+ options"]'));
  }

  getDisabledOptionsSelectDemo() {
    return element(by.css('[placeholder="Some options disabled"]'));
  }

  getCountrySelectDemo() {
    return element(by.css('[placeholder="Select your country"]'));
  }

  getCategorySelectDemo() {
    return element(by.css('[placeholder="Select categories"]'));
  }

  // Form Integration
  getFormSection() {
    return element(by.css('.form-demo'));
  }

  getFormLabels() {
    return element.all(by.css('.form-field label'));
  }

  getSubmitButton() {
    return element(by.css('.btn-primary'));
  }

  getResetButton() {
    return element(by.css('.btn-secondary'));
  }

  getFillButton() {
    return element(by.css('.btn-info'));
  }

  getFormStatus() {
    return element(by.css('.form-status'));
  }

  getFormActions() {
    return element(by.css('.form-actions'));
  }

  // State Demos
  getDisabledStateDemo() {
    return element(by.css('[placeholder="Disabled select"]'));
  }

  getEmptyOptionsDemo() {
    return element(by.css('[placeholder="No options available"]'));
  }

  getPreSelectedDemo() {
    return element(by.css('[placeholder="Pre-selected options"]'));
  }

  getDynamicOptionsDemo() {
    return element(by.css('[placeholder="Dynamic options"]'));
  }

  getAddDynamicOptionButton() {
    return element(by.css('.dynamic-controls .btn:first-child'));
  }

  getRemoveDynamicOptionButton() {
    return element(by.css('.dynamic-controls .btn:last-child'));
  }

  // Responsive Demos
  getFullWidthSelectDemo() {
    return element(by.css('[placeholder="This select adapts to container width"]'));
  }

  getCompactSelectDemo() {
    return element(by.css('[placeholder="Compact"]'));
  }

  getWideSelectDemo() {
    return element(by.css('[placeholder="Wide select"]'));
  }

  // Performance Demos
  getVirtualScrollDemo() {
    return element(by.css('[placeholder="Select from 1000+ items"]'));
  }

  getSearchPerformanceDemo() {
    return element(by.css('[placeholder="Search through 500 items"]'));
  }

  // Dropdown Options
  getFirstOption() {
    return element(by.css('.nxt-dropdown-option:first-child'));
  }

  getSecondOption() {
    return element(by.css('.nxt-dropdown-option:nth-child(2)'));
  }

  getAllOptions() {
    return element.all(by.css('.nxt-dropdown-option'));
  }

  getApplyButton() {
    return element(by.css('.nxt-dropdown-btn-apply'));
  }

  getCancelButton() {
    return element(by.css('.nxt-dropdown-btn-cancel'));
  }

  // Result Text
  getSingleSelectResult(): Promise<string> {
    return element(by.css('.demo-card:first-child .result')).getText() as Promise<string>;
  }

  getMultipleSelectResult(): Promise<string> {
    return element(by.css('.demo-card:nth-child(2) .result')).getText() as Promise<string>;
  }

  getConfirmationSelectResult(): Promise<string> {
    return element(by.css('.demo-card:nth-child(3) .result')).getText() as Promise<string>;
  }

  // Form Validation
  getRequiredFieldError() {
    return element(by.css('.nxt-dropdown-error'));
  }

  // Accessibility
  getSectionHeadings() {
    return element.all(by.css('h2'));
  }

  getAllButtons() {
    return element.all(by.css('button'));
  }

  getAllSelectElements() {
    return element.all(by.css('nxt-dropdown'));
  }

  // Dynamic Options
  async getDynamicOptionsCount(): Promise<number> {
    const resultText = await element(by.css('.demo-card:last-child .result')).getText();
    const match = resultText.match(/Options: (\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
} 
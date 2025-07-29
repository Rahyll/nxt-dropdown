import { browser, logging } from 'protractor';
// @ts-ignore
import { AppPage } from './app.po';

describe('NTX Select Demo App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  describe('Page Load and Navigation', () => {
    it('should display welcome message', () => {
      page.navigateTo();
      expect(page.getTitleText()).toContain('NTX Select Component - Comprehensive Demo');
    });

    it('should display all demo sections', () => {
      page.navigateTo();
      expect(page.getDemoSections().count()).toBeGreaterThan(5);
    });

    it('should have proper page structure', () => {
      page.navigateTo();
      expect(page.getMainHeading()).toContain('NTX Select Component');
      expect(page.getDemoCards().count()).toBeGreaterThan(10);
    });
  });

  describe('Tab Navigation', () => {
    beforeEach(() => {
      page.navigateTo();
    });

    it('should display tab navigation', () => {
      const demoTab = page.getDemoTabButton();
      const guideTab = page.getGuideTabButton();
      
      expect(demoTab.isPresent()).toBeTruthy();
      expect(guideTab.isPresent()).toBeTruthy();
    });

    it('should have demo tab active by default', async () => {
      const activeTab = await page.getActiveTab();
      expect(activeTab).toContain('Demo');
    });

    it('should switch to guide tab when clicked', async () => {
      await page.clickGuideTab();
      const activeTab = await page.getActiveTab();
      expect(activeTab).toContain('Guide');
    });

    it('should switch back to demo tab when clicked', async () => {
      await page.clickGuideTab();
      await page.clickDemoTab();
      const activeTab = await page.getActiveTab();
      expect(activeTab).toContain('Demo');
    });

    it('should show demo content when demo tab is active', () => {
      const demoContent = page.getDemoTabContent();
      expect(demoContent.isPresent()).toBeTruthy();
    });

    it('should show guide content when guide tab is active', async () => {
      await page.clickGuideTab();
      const guideContent = page.getGuideTabContent();
      expect(guideContent.isPresent()).toBeTruthy();
    });
  });

  describe('Guide Content', () => {
    beforeEach(async () => {
      page.navigateTo();
      await page.clickGuideTab();
    });

    it('should display guide section', () => {
      const guideSection = page.getGuideSection();
      expect(guideSection.isPresent()).toBeTruthy();
    });

    it('should display guide introduction', () => {
      const guideIntro = page.getGuideIntro();
      expect(guideIntro.isPresent()).toBeTruthy();
    });

    it('should display multiple guide subsections', () => {
      const subsections = page.getGuideSubsections();
      expect(subsections.count()).toBeGreaterThan(5);
    });

    it('should display code blocks', () => {
      const codeBlocks = page.getCodeBlocks();
      expect(codeBlocks.count()).toBeGreaterThan(0);
    });

    it('should display property tables', () => {
      const propertyTables = page.getPropertyTables();
      expect(propertyTables.count()).toBeGreaterThan(0);
    });

    it('should display example cards', () => {
      const exampleCards = page.getExampleCards();
      expect(exampleCards.count()).toBeGreaterThan(0);
    });

    it('should display best practices section', () => {
      const bestPractices = page.getBestPractices();
      expect(bestPractices.count()).toBeGreaterThan(0);
    });

    it('should display troubleshooting section', () => {
      const troubleshooting = page.getTroubleshootingSection();
      expect(troubleshooting.isPresent()).toBeTruthy();
    });

    it('should display API reference section', () => {
      const apiReference = page.getApiReference();
      expect(apiReference.isPresent()).toBeTruthy();
    });
  });

  describe('Basic Demos', () => {
    beforeEach(() => {
      page.navigateTo();
    });

    it('should display single selection demo', () => {
      const singleSelect = page.getSingleSelectDemo();
      expect(singleSelect.isPresent()).toBeTruthy();
      expect(singleSelect.getAttribute('placeholder')).toContain('Select an option');
    });

    it('should display multiple selection demo', () => {
      const multipleSelect = page.getMultipleSelectDemo();
      expect(multipleSelect.isPresent()).toBeTruthy();
      expect(multipleSelect.getAttribute('placeholder')).toContain('Select multiple options');
    });

    it('should display confirmation demo', () => {
      const confirmationSelect = page.getConfirmationSelectDemo();
      expect(confirmationSelect.isPresent()).toBeTruthy();
      expect(confirmationSelect.getAttribute('placeholder')).toContain('Select with confirmation');
    });

    it('should display required field demo', () => {
      const requiredSelect = page.getRequiredSelectDemo();
      expect(requiredSelect.isPresent()).toBeTruthy();
      expect(requiredSelect.getAttribute('placeholder')).toContain('Required field');
    });
  });

  describe('Advanced Demos', () => {
    beforeEach(() => {
      page.navigateTo();
    });

    it('should display large dataset demo', () => {
      const largeDatasetSelect = page.getLargeDatasetSelectDemo();
      expect(largeDatasetSelect.isPresent()).toBeTruthy();
      expect(largeDatasetSelect.getAttribute('placeholder')).toContain('Select from 50+ options');
    });

    it('should display disabled options demo', () => {
      const disabledOptionsSelect = page.getDisabledOptionsSelectDemo();
      expect(disabledOptionsSelect.isPresent()).toBeTruthy();
      expect(disabledOptionsSelect.getAttribute('placeholder')).toContain('Some options disabled');
    });

    it('should display country selection demo', () => {
      const countrySelect = page.getCountrySelectDemo();
      expect(countrySelect.isPresent()).toBeTruthy();
      expect(countrySelect.getAttribute('placeholder')).toContain('Select your country');
    });

    it('should display category selection demo', () => {
      const categorySelect = page.getCategorySelectDemo();
      expect(categorySelect.isPresent()).toBeTruthy();
      expect(categorySelect.getAttribute('placeholder')).toContain('Select categories');
    });
  });

  describe('Form Integration', () => {
    beforeEach(() => {
      page.navigateTo();
    });

    it('should display reactive form section', () => {
      const formSection = page.getFormSection();
      expect(formSection.isPresent()).toBeTruthy();
    });

    it('should have form fields with proper labels', () => {
      const formLabels = page.getFormLabels();
      expect(formLabels.count()).toBeGreaterThan(0);
    });

    it('should display form action buttons', () => {
      const submitButton = page.getSubmitButton();
      const resetButton = page.getResetButton();
      const fillButton = page.getFillButton();

      expect(submitButton.isPresent()).toBeTruthy();
      expect(resetButton.isPresent()).toBeTruthy();
      expect(fillButton.isPresent()).toBeTruthy();
    });

    it('should display form status section', () => {
      const formStatus = page.getFormStatus();
      expect(formStatus.isPresent()).toBeTruthy();
    });

    it('should show form as invalid initially', () => {
      const submitButton = page.getSubmitButton();
      expect(submitButton.isEnabled()).toBeFalsy();
    });
  });

  describe('State Demos', () => {
    beforeEach(() => {
      page.navigateTo();
    });

    it('should display disabled state demo', () => {
      const disabledSelect = page.getDisabledStateDemo();
      expect(disabledSelect.isPresent()).toBeTruthy();
      expect(disabledSelect.getAttribute('placeholder')).toContain('Disabled select');
    });

    it('should display empty options demo', () => {
      const emptyOptionsSelect = page.getEmptyOptionsDemo();
      expect(emptyOptionsSelect.isPresent()).toBeTruthy();
      expect(emptyOptionsSelect.getAttribute('placeholder')).toContain('No options available');
    });

    it('should display pre-selected values demo', () => {
      const preSelectedSelect = page.getPreSelectedDemo();
      expect(preSelectedSelect.isPresent()).toBeTruthy();
      expect(preSelectedSelect.getAttribute('placeholder')).toContain('Pre-selected options');
    });

    it('should display dynamic options demo', () => {
      const dynamicSelect = page.getDynamicOptionsDemo();
      expect(dynamicSelect.isPresent()).toBeTruthy();
      expect(dynamicSelect.getAttribute('placeholder')).toContain('Dynamic options');
    });

    it('should display dynamic controls', () => {
      const addButton = page.getAddDynamicOptionButton();
      const removeButton = page.getRemoveDynamicOptionButton();

      expect(addButton.isPresent()).toBeTruthy();
      expect(removeButton.isPresent()).toBeTruthy();
    });
  });

  describe('Responsive Demos', () => {
    beforeEach(() => {
      page.navigateTo();
    });

    it('should display full width select demo', () => {
      const fullWidthSelect = page.getFullWidthSelectDemo();
      expect(fullWidthSelect.isPresent()).toBeTruthy();
      expect(fullWidthSelect.getAttribute('placeholder')).toContain('This select adapts to container width');
    });

    it('should display compact select demo', () => {
      const compactSelect = page.getCompactSelectDemo();
      expect(compactSelect.isPresent()).toBeTruthy();
      expect(compactSelect.getAttribute('placeholder')).toContain('Compact');
    });

    it('should display wide select demo', () => {
      const wideSelect = page.getWideSelectDemo();
      expect(wideSelect.isPresent()).toBeTruthy();
      expect(wideSelect.getAttribute('placeholder')).toContain('Wide select');
    });
  });

  describe('Performance Demos', () => {
    beforeEach(() => {
      page.navigateTo();
    });

    it('should display virtual scrolling demo', () => {
      const virtualScrollSelect = page.getVirtualScrollDemo();
      expect(virtualScrollSelect.isPresent()).toBeTruthy();
      expect(virtualScrollSelect.getAttribute('placeholder')).toContain('Select from 1000+ items');
    });

    it('should display search performance demo', () => {
      const searchPerformanceSelect = page.getSearchPerformanceDemo();
      expect(searchPerformanceSelect.isPresent()).toBeTruthy();
      expect(searchPerformanceSelect.getAttribute('placeholder')).toContain('Search through 500 items');
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      page.navigateTo();
    });

    it('should handle single selection', async () => {
      const singleSelect = page.getSingleSelectDemo();
      await singleSelect.click();
      
      // Wait for dropdown to open
      await browser.sleep(500);
      
      const firstOption = page.getFirstOption();
      await firstOption.click();
      
      // Check if selection is made
      const resultText = page.getSingleSelectResult();
      expect(resultText).toContain('Selected: option1');
    });

    it('should handle multiple selection', async () => {
      const multipleSelect = page.getMultipleSelectDemo();
      await multipleSelect.click();
      
      await browser.sleep(500);
      
      const firstOption = page.getFirstOption();
      const secondOption = page.getSecondOption();
      
      await firstOption.click();
      await secondOption.click();
      
      const resultText = page.getMultipleSelectResult();
      expect(resultText).toContain('Selected: 2 items');
    });

    it('should handle confirmation mode', async () => {
      const confirmationSelect = page.getConfirmationSelectDemo();
      await confirmationSelect.click();
      
      await browser.sleep(500);
      
      const firstOption = page.getFirstOption();
      await firstOption.click();
      
      const applyButton = page.getApplyButton();
      await applyButton.click();
      
      const resultText = page.getConfirmationSelectResult();
      expect(resultText).toContain('Selected: 1 items');
    });

    it('should handle form submission', async () => {
      const fillButton = page.getFillButton();
      await fillButton.click();
      
      const submitButton = page.getSubmitButton();
      expect(submitButton.isEnabled()).toBeTruthy();
      
      await submitButton.click();
      
      // Should show success message
      const alert = browser.switchTo().alert();
      expect(alert.getText()).toContain('Form submitted successfully');
      await alert.accept();
    });

    it('should handle form reset', async () => {
      const fillButton = page.getFillButton();
      await fillButton.click();
      
      const resetButton = page.getResetButton();
      await resetButton.click();
      
      const submitButton = page.getSubmitButton();
      expect(submitButton.isEnabled()).toBeFalsy();
    });

    it('should handle dynamic option addition', async () => {
      const initialOptionsCount = await page.getDynamicOptionsCount();
      
      const addButton = page.getAddDynamicOptionButton();
      await addButton.click();
      
      const newOptionsCount = await page.getDynamicOptionsCount();
      expect(newOptionsCount).toBe(initialOptionsCount + 1);
    });

    it('should handle dynamic option removal', async () => {
      const initialOptionsCount = await page.getDynamicOptionsCount();
      
      if (initialOptionsCount > 1) {
        const removeButton = page.getRemoveDynamicOptionButton();
        await removeButton.click();
        
        const newOptionsCount = await page.getDynamicOptionsCount();
        expect(newOptionsCount).toBe(initialOptionsCount - 1);
      }
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      page.navigateTo();
    });

    it('should show form as invalid initially', () => {
      const submitButton = page.getSubmitButton();
      expect(submitButton.isEnabled()).toBeFalsy();
    });

    it('should enable submit button when form is valid', async () => {
      const fillButton = page.getFillButton();
      await fillButton.click();
      
      const submitButton = page.getSubmitButton();
      expect(submitButton.isEnabled()).toBeTruthy();
    });

    it('should show validation errors for required fields', () => {
      const requiredSelect = page.getRequiredSelectDemo();
      expect(requiredSelect.isPresent()).toBeTruthy();
      
      // Check if error message is displayed when required field is empty
      const errorMessage = page.getRequiredFieldError();
      expect(errorMessage.isPresent()).toBeTruthy();
    });
  });

  describe('Responsive Design', () => {
    it('should adapt to mobile screen size', async () => {
      page.navigateTo();
      
      // Set mobile viewport
      await browser.driver.manage().window().setSize(375, 667);
      
      const demoGrid = page.getDemoGrid();
      expect(demoGrid.isPresent()).toBeTruthy();
      
      // Check if layout adapts to mobile
      const formActions = page.getFormActions();
      expect(formActions.isPresent()).toBeTruthy();
    });

    it('should adapt to tablet screen size', async () => {
      page.navigateTo();
      
      // Set tablet viewport
      await browser.driver.manage().window().setSize(768, 1024);
      
      const demoGrid = page.getDemoGrid();
      expect(demoGrid.isPresent()).toBeTruthy();
    });

    it('should adapt to desktop screen size', async () => {
      page.navigateTo();
      
      // Set desktop viewport
      await browser.driver.manage().window().setSize(1200, 800);
      
      const demoGrid = page.getDemoGrid();
      expect(demoGrid.isPresent()).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      page.navigateTo();
    });

    it('should have proper heading structure', () => {
      const mainHeading = page.getMainHeading();
      const sectionHeadings = page.getSectionHeadings();
      
      expect(mainHeading).toBeTruthy();
      expect(sectionHeadings.count()).toBeGreaterThan(0);
    });

    it('should have proper form labels', () => {
      const formLabels = page.getFormLabels();
      expect(formLabels.count()).toBeGreaterThan(0);
    });

    it('should have proper button types', () => {
      const buttons = page.getAllButtons();
      buttons.each(async (button) => {
        const type = await button.getAttribute('type');
        expect(['submit', 'button'].includes(type)).toBeTruthy();
      });
    });

    it('should have proper ARIA attributes', () => {
      const selectElements = page.getAllSelectElements();
      selectElements.each(async (select) => {
        const role = await select.getAttribute('role');
        expect(role).toBe('combobox');
      });
    });
  });

  describe('Performance', () => {
    beforeEach(() => {
      page.navigateTo();
    });

    it('should load large datasets efficiently', async () => {
      const largeDatasetSelect = page.getLargeDatasetSelectDemo();
      await largeDatasetSelect.click();
      
      await browser.sleep(1000); // Wait for options to load
      
      const options = page.getAllOptions();
      expect(options.count()).toBeGreaterThan(0);
    });

    it('should handle virtual scrolling performance', async () => {
      const virtualScrollSelect = page.getVirtualScrollDemo();
      await virtualScrollSelect.click();
      
      await browser.sleep(1000); // Wait for options to load
      
      const options = page.getAllOptions();
      expect(options.count()).toBeGreaterThan(0);
    });
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    // @ts-ignore
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as any));
  });
}); 
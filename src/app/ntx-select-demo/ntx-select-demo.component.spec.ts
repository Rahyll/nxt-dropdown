import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NtxSelectDemoComponent } from './ntx-select-demo.component';
import { NtxSelectComponent } from '../ntx-select/ntx-select.component';

describe('NtxSelectDemoComponent', () => {
  let component: NtxSelectDemoComponent;
  let fixture: ComponentFixture<NtxSelectDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NtxSelectDemoComponent, NtxSelectComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(NtxSelectDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.selectedValue).toBeNull();
      expect(component.selectedMultipleValues).toEqual([]);
      expect(component.selectedMultipleValuesWithConfirmation).toEqual([]);
      expect(component.requiredValue).toBeNull();
    });

    it('should initialize reactive form', () => {
      expect(component.reactiveForm).toBeTruthy();
      expect(component.reactiveForm.get('singleSelect')).toBeTruthy();
      expect(component.reactiveForm.get('multipleSelect')).toBeTruthy();
      expect(component.reactiveForm.get('multipleSelectWithConfirmation')).toBeTruthy();
      expect(component.reactiveForm.get('country')).toBeTruthy();
    });

    it('should initialize with sample options', () => {
      expect(component.options.length).toBeGreaterThan(0);
      expect(component.countryOptions.length).toBeGreaterThan(0);
      expect(component.categoryOptions.length).toBeGreaterThan(0);
    });

    it('should initialize large dataset options', () => {
      expect(component.largeDatasetOptions.length).toBe(50);
      expect(component.virtualScrollOptions.length).toBe(1000);
      expect(component.searchPerformanceOptions.length).toBe(500);
    });
  });

  describe('Basic Demos', () => {
    it('should display single selection demo', () => {
      const singleSelectDemo = fixture.debugElement.query(By.css('[placeholder="Select an option"]'));
      expect(singleSelectDemo).toBeTruthy();
    });

    it('should display multiple selection demo', () => {
      const multipleSelectDemo = fixture.debugElement.query(By.css('[placeholder="Select multiple options"]'));
      expect(multipleSelectDemo).toBeTruthy();
    });

    it('should display confirmation demo', () => {
      const confirmationDemo = fixture.debugElement.query(By.css('[placeholder="Select with confirmation"]'));
      expect(confirmationDemo).toBeTruthy();
    });

    it('should display required field demo', () => {
      const requiredDemo = fixture.debugElement.query(By.css('[placeholder="Required field"]'));
      expect(requiredDemo).toBeTruthy();
    });
  });

  describe('Advanced Demos', () => {
    it('should display large dataset demo', () => {
      const largeDatasetDemo = fixture.debugElement.query(By.css('[placeholder="Select from 50+ options"]'));
      expect(largeDatasetDemo).toBeTruthy();
    });

    it('should display disabled options demo', () => {
      const disabledOptionsDemo = fixture.debugElement.query(By.css('[placeholder="Some options disabled"]'));
      expect(disabledOptionsDemo).toBeTruthy();
    });

    it('should display country selection demo', () => {
      const countryDemo = fixture.debugElement.query(By.css('[placeholder="Select your country"]'));
      expect(countryDemo).toBeTruthy();
    });

    it('should display category selection demo', () => {
      const categoryDemo = fixture.debugElement.query(By.css('[placeholder="Select categories"]'));
      expect(categoryDemo).toBeTruthy();
    });
  });

  describe('Form Integration', () => {
    it('should display reactive form section', () => {
      const formSection = fixture.debugElement.query(By.css('.form-demo'));
      expect(formSection).toBeTruthy();
    });

    it('should have form fields with labels', () => {
      const labels = fixture.debugElement.queryAll(By.css('.form-field label'));
      expect(labels.length).toBeGreaterThan(0);
    });

    it('should display form actions', () => {
      const submitButton = fixture.debugElement.query(By.css('.btn-primary'));
      const resetButton = fixture.debugElement.query(By.css('.btn-secondary'));
      const fillButton = fixture.debugElement.query(By.css('.btn-info'));
      
      expect(submitButton).toBeTruthy();
      expect(resetButton).toBeTruthy();
      expect(fillButton).toBeTruthy();
    });

    it('should display form status section', () => {
      const formStatus = fixture.debugElement.query(By.css('.form-status'));
      expect(formStatus).toBeTruthy();
    });
  });

  describe('State Demos', () => {
    it('should display disabled state demo', () => {
      const disabledDemo = fixture.debugElement.query(By.css('[placeholder="Disabled select"]'));
      expect(disabledDemo).toBeTruthy();
    });

    it('should display empty options demo', () => {
      const emptyOptionsDemo = fixture.debugElement.query(By.css('[placeholder="No options available"]'));
      expect(emptyOptionsDemo).toBeTruthy();
    });

    it('should display pre-selected values demo', () => {
      const preSelectedDemo = fixture.debugElement.query(By.css('[placeholder="Pre-selected options"]'));
      expect(preSelectedDemo).toBeTruthy();
    });

    it('should display dynamic options demo', () => {
      const dynamicDemo = fixture.debugElement.query(By.css('[placeholder="Dynamic options"]'));
      expect(dynamicDemo).toBeTruthy();
    });

    it('should display dynamic controls', () => {
      const addButton = fixture.debugElement.query(By.css('.dynamic-controls .btn:first-child'));
      const removeButton = fixture.debugElement.query(By.css('.dynamic-controls .btn:last-child'));
      
      expect(addButton).toBeTruthy();
      expect(removeButton).toBeTruthy();
    });
  });

  describe('Responsive Demos', () => {
    it('should display full width select demo', () => {
      const fullWidthDemo = fixture.debugElement.query(By.css('[placeholder="This select adapts to container width"]'));
      expect(fullWidthDemo).toBeTruthy();
    });

    it('should display compact select demo', () => {
      const compactDemo = fixture.debugElement.query(By.css('[placeholder="Compact"]'));
      expect(compactDemo).toBeTruthy();
    });

    it('should display wide select demo', () => {
      const wideDemo = fixture.debugElement.query(By.css('[placeholder="Wide select"]'));
      expect(wideDemo).toBeTruthy();
    });
  });

  describe('Performance Demos', () => {
    it('should display virtual scrolling demo', () => {
      const virtualScrollDemo = fixture.debugElement.query(By.css('[placeholder="Select from 1000+ items"]'));
      expect(virtualScrollDemo).toBeTruthy();
    });

    it('should display search performance demo', () => {
      const searchPerformanceDemo = fixture.debugElement.query(By.css('[placeholder="Search through 500 items"]'));
      expect(searchPerformanceDemo).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should handle selection change events', () => {
      spyOn(component, 'onSelectionChange');
      const singleSelect = fixture.debugElement.query(By.css('[placeholder="Select an option"]'));
      
      // Simulate selection change
      component.selectedValue = 'option1';
      singleSelect.triggerEventHandler('selectionChange', 'option1');
      
      expect(component.onSelectionChange).toHaveBeenCalledWith('option1');
    });

    it('should handle form submission', fakeAsync(() => {
      spyOn(window, 'alert');
      spyOn(console, 'log');
      
      // Fill form with valid data
      component.reactiveForm.patchValue({
        singleSelect: 'option1',
        multipleSelect: ['option2'],
        multipleSelectWithConfirmation: ['option3'],
        country: 'us'
      });
      
      const submitButton = fixture.debugElement.query(By.css('.btn-primary'));
      submitButton.triggerEventHandler('click', null);
      tick();
      
      expect(console.log).toHaveBeenCalledWith('Form submitted:', component.reactiveForm.value);
    }));

    it('should handle form reset', () => {
      spyOn(component.reactiveForm, 'reset');
      
      // Set some values first
      component.selectedValue = 'option1';
      component.selectedMultipleValues = ['option2'];
      
      const resetButton = fixture.debugElement.query(By.css('.btn-secondary'));
      resetButton.triggerEventHandler('click', null);
      
      expect(component.reactiveForm.reset).toHaveBeenCalled();
      expect(component.selectedValue).toBeNull();
      expect(component.selectedMultipleValues).toEqual([]);
    });

    it('should handle fill form', () => {
      const fillButton = fixture.debugElement.query(By.css('.btn-info'));
      fillButton.triggerEventHandler('click', null);
      
      expect(component.reactiveForm.get('singleSelect')?.value).toBe('option1');
      expect(component.reactiveForm.get('multipleSelect')?.value).toEqual(['option2', 'option4']);
      expect(component.reactiveForm.get('multipleSelectWithConfirmation')?.value).toEqual(['option5', 'option6']);
      expect(component.reactiveForm.get('country')?.value).toBe('us');
    });

    it('should handle dynamic option addition', () => {
      const initialLength = component.dynamicOptions.length;
      const addButton = fixture.debugElement.query(By.css('.dynamic-controls .btn:first-child'));
      
      addButton.triggerEventHandler('click', null);
      
      expect(component.dynamicOptions.length).toBe(initialLength + 1);
      expect(component.dynamicOptions[initialLength].value).toBe(`dynamic${initialLength + 1}`);
    });

    it('should handle dynamic option removal', () => {
      const initialLength = component.dynamicOptions.length;
      const removeButton = fixture.debugElement.query(By.css('.dynamic-controls .btn:last-child'));
      
      removeButton.triggerEventHandler('click', null);
      
      expect(component.dynamicOptions.length).toBe(initialLength - 1);
    });

    it('should not remove dynamic options below minimum', () => {
      // Set to minimum options
      component.dynamicOptions = [
        { value: 'dynamic1', label: 'Dynamic Option 1' }
      ];
      fixture.detectChanges();
      
      const removeButton = fixture.debugElement.query(By.css('.dynamic-controls .btn:last-child'));
      removeButton.triggerEventHandler('click', null);
      
      expect(component.dynamicOptions.length).toBe(1);
    });
  });

  describe('Form Validation', () => {
    it('should show form as invalid initially', () => {
      expect(component.reactiveForm.valid).toBeFalse();
    });

    it('should show form as valid when all required fields are filled', () => {
      component.reactiveForm.patchValue({
        singleSelect: 'option1',
        multipleSelect: ['option2'],
        multipleSelectWithConfirmation: ['option3'],
        country: 'us'
      });
      
      expect(component.reactiveForm.valid).toBeTrue();
    });

    it('should disable submit button when form is invalid', () => {
      const submitButton = fixture.debugElement.query(By.css('.btn-primary'));
      expect(submitButton.nativeElement.disabled).toBeTrue();
    });

    it('should enable submit button when form is valid', () => {
      component.reactiveForm.patchValue({
        singleSelect: 'option1',
        multipleSelect: ['option2'],
        multipleSelectWithConfirmation: ['option3'],
        country: 'us'
      });
      fixture.detectChanges();
      
      const submitButton = fixture.debugElement.query(By.css('.btn-primary'));
      expect(submitButton.nativeElement.disabled).toBeFalse();
    });
  });

  describe('Demo Sections', () => {
    it('should display all demo sections', () => {
      const sections = fixture.debugElement.queryAll(By.css('.demo-section'));
      expect(sections.length).toBeGreaterThan(5); // Should have multiple sections
    });

    it('should display demo cards in grid layout', () => {
      const cards = fixture.debugElement.queryAll(By.css('.demo-card'));
      expect(cards.length).toBeGreaterThan(10); // Should have many demo cards
    });

    it('should display result text for each demo', () => {
      const results = fixture.debugElement.queryAll(By.css('.result'));
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid layout', () => {
      const demoGrid = fixture.debugElement.query(By.css('.demo-grid'));
      expect(demoGrid).toBeTruthy();
    });

    it('should have responsive form layout', () => {
      const formRow = fixture.debugElement.query(By.css('.form-row'));
      expect(formRow).toBeTruthy();
    });

    it('should have responsive status grid', () => {
      const statusGrid = fixture.debugElement.query(By.css('.status-grid'));
      expect(statusGrid).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      const h1 = fixture.debugElement.query(By.css('h1'));
      const h2s = fixture.debugElement.queryAll(By.css('h2'));
      const h3s = fixture.debugElement.queryAll(By.css('h3'));
      
      expect(h1).toBeTruthy();
      expect(h2s.length).toBeGreaterThan(0);
      expect(h3s.length).toBeGreaterThan(0);
    });

    it('should have proper form labels', () => {
      const labels = fixture.debugElement.queryAll(By.css('label'));
      expect(labels.length).toBeGreaterThan(0);
    });

    it('should have proper button types', () => {
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      buttons.forEach(button => {
        const type = button.nativeElement.getAttribute('type');
        expect(['submit', 'button'].includes(type)).toBeTrue();
      });
    });
  });

  describe('Data Management', () => {
    it('should initialize with correct option data', () => {
      expect(component.options[0].value).toBe('option1');
      expect(component.options[0].label).toBe('Option 1');
      expect(component.options[2].disabled).toBeTrue(); // option3 is disabled
    });

    it('should have correct country options', () => {
      const usOption = component.countryOptions.find(opt => opt.value === 'us');
      expect(usOption).toBeTruthy();
      expect(usOption?.label).toBe('United States');
    });

    it('should have correct category options', () => {
      const techOption = component.categoryOptions.find(opt => opt.value === 'tech');
      expect(techOption).toBeTruthy();
      expect(techOption?.label).toBe('Technology');
    });

    it('should generate large datasets correctly', () => {
      expect(component.largeDatasetOptions[0].value).toBe('large1');
      expect(component.largeDatasetOptions[0].label).toBe('Large Dataset Option 1');
      expect(component.largeDatasetOptions[49].value).toBe('large50');
    });
  });

  describe('Component Lifecycle', () => {
    it('should subscribe to form changes on init', () => {
      spyOn(component.reactiveForm.valueChanges, 'subscribe');
      component.ngOnInit();
      expect(component.reactiveForm.valueChanges.subscribe).toHaveBeenCalled();
    });

    it('should handle form value changes', () => {
      spyOn(console, 'log');
      component.reactiveForm.patchValue({ singleSelect: 'option1' });
      expect(console.log).toHaveBeenCalledWith('Reactive form values:', jasmine.any(Object));
    });
  });
}); 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NtxSelectOption } from '../ntx-select/ntx-select.component';

@Component({
  selector: 'app-ntx-select-demo',
  templateUrl: './ntx-select-demo.component.html',
  styleUrls: ['./ntx-select-demo.component.scss']
})
export class NtxSelectDemoComponent implements OnInit {
  // Tab management
  activeTab: 'demo' | 'guide' = 'demo';

  // Template-driven form values
  selectedValue: any = null;
  selectedMultipleValues: any[] = [];
  selectedMultipleValuesWithConfirmation: any[] = [];
  requiredValue: any = null;

  // Advanced demo values
  largeDatasetValue: any[] = [];
  disabledOptionsValue: any = null;
  countryValue: any = null;
  categoryValue: any[] = [];

  // State demo values
  emptyOptionsValue: any = null;
  preSelectedValue: any[] = ['option1', 'option3'];
  dynamicValue: any = null;
  dynamicOptions: NtxSelectOption[] = [
    { value: 'dynamic1', label: 'Dynamic Option 1' },
    { value: 'dynamic2', label: 'Dynamic Option 2' }
  ];

  // Responsive demo values
  responsiveValue: any[] = [];
  compactValue: any = null;
  wideValue: any = null;

  // Performance demo values
  virtualScrollValue: any = null;
  searchPerformanceValue: any[] = [];

  // Reactive form
  reactiveForm: FormGroup;

  // Sample options
  options: NtxSelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
    { value: 'option4', label: 'Option 4' },
    { value: 'option5', label: 'Option 5' },
    { value: 'option6', label: 'Option 6' },
    { value: 'option7', label: 'Option 7' },
    { value: 'option8', label: 'Option 8' },
    { value: 'option9', label: 'Option 9' },
    { value: 'option10', label: 'Option 10' }
  ];

  // Large dataset options
  largeDatasetOptions: NtxSelectOption[] = Array.from({ length: 50 }, (_, i) => ({
    value: `large${i + 1}`,
    label: `Large Dataset Option ${i + 1}`
  }));

  // Options with disabled items
  optionsWithDisabled: NtxSelectOption[] = [
    { value: 'enabled1', label: 'Enabled Option 1' },
    { value: 'disabled1', label: 'Disabled Option 1', disabled: true },
    { value: 'enabled2', label: 'Enabled Option 2' },
    { value: 'disabled2', label: 'Disabled Option 2', disabled: true },
    { value: 'enabled3', label: 'Enabled Option 3' }
  ];

  // Country options
  countryOptions: NtxSelectOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'in', label: 'India' },
    { value: 'br', label: 'Brazil' },
    { value: 'mx', label: 'Mexico' }
  ];

  // Category options
  categoryOptions: NtxSelectOption[] = [
    { value: 'tech', label: 'Technology' },
    { value: 'health', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'sports', label: 'Sports' },
    { value: 'travel', label: 'Travel' },
    { value: 'food', label: 'Food & Dining' }
  ];

  // Virtual scroll options (1000+ items)
  virtualScrollOptions: NtxSelectOption[] = Array.from({ length: 1000 }, (_, i) => ({
    value: `virtual${i + 1}`,
    label: `Virtual Option ${i + 1}`
  }));

  // Search performance options (500 items)
  searchPerformanceOptions: NtxSelectOption[] = Array.from({ length: 500 }, (_, i) => ({
    value: `search${i + 1}`,
    label: `Search Option ${i + 1}`
  }));

  constructor(private fb: FormBuilder) {
    this.reactiveForm = this.fb.group({
      singleSelect: ['', Validators.required],
      multipleSelect: [[], Validators.required],
      multipleSelectWithConfirmation: [[], Validators.required],
      country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Initialize any additional setup
  }

  // Tab management method
  setActiveTab(tab: 'demo' | 'guide'): void {
    this.activeTab = tab;
  }

  onSelectionChange(value: any): void {
    console.log('Selection changed:', value);
  }

  onSubmit(): void {
    if (this.reactiveForm.valid) {
      alert('Form submitted successfully!');
      console.log('Form values:', this.reactiveForm.value);
    } else {
      alert('Please fill in all required fields.');
    }
  }

  resetForm(): void {
    this.reactiveForm.reset();
    this.selectedValue = null;
    this.selectedMultipleValues = [];
    this.selectedMultipleValuesWithConfirmation = [];
    this.requiredValue = null;
    this.largeDatasetValue = [];
    this.disabledOptionsValue = null;
    this.countryValue = null;
    this.categoryValue = [];
    this.emptyOptionsValue = null;
    this.preSelectedValue = ['option1', 'option3'];
    this.dynamicValue = null;
    this.responsiveValue = [];
    this.compactValue = null;
    this.wideValue = null;
    this.virtualScrollValue = null;
    this.searchPerformanceValue = [];
  }

  fillForm(): void {
    this.reactiveForm.patchValue({
      singleSelect: 'option1',
      multipleSelect: ['option1', 'option2'],
      multipleSelectWithConfirmation: ['option3', 'option4'],
      country: 'us'
    });
  }

  addDynamicOption(): void {
    const newIndex = this.dynamicOptions.length + 1;
    this.dynamicOptions.push({
      value: `dynamic${newIndex}`,
      label: `Dynamic Option ${newIndex}`
    });
  }

  removeDynamicOption(): void {
    if (this.dynamicOptions.length > 1) {
      this.dynamicOptions.pop();
      if (this.dynamicValue && !this.dynamicOptions.find(opt => opt.value === this.dynamicValue)) {
        this.dynamicValue = null;
      }
    }
  }
} 
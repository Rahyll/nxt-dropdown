/**
 * Dropdown Demo Component
 * 
 * This component demonstrates all the features and capabilities of the NXT Dropdown component.
 * It provides examples of different configurations, use cases, and integration patterns.
 * The component includes both template-driven and reactive form examples.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NxtDropdownOption, NxtDropdownConfig } from '../nxt-dropdown/interfaces';

@Component({
  selector: 'app-nxt-dropdown-demo',
  templateUrl: './nxt-dropdown-demo.component.html',
  styleUrls: ['./nxt-dropdown-demo.component.scss']
})
export class NxtDropdownDemoComponent implements OnInit {
  
  // ==================== TAB MANAGEMENT ====================
  
  /**
   * Currently active tab in the demo interface
   * Controls whether to show the demo examples or the usage guide
   * Default: 'demo'
   */
  activeTab: 'demo' | 'guide' = 'demo';

  // ==================== TEMPLATE-DRIVEN FORM VALUES ====================
  
  /**
   * Single selection value for basic dropdown demo
   * Default: null (no selection)
   */
  selectedValue: any = null;
  
  /**
   * Multiple selection values for multiple dropdown demo
   * Default: empty array (no selections)
   */
  selectedMultipleValues: any[] = [];
  
  /**
   * Multiple selection values with confirmation mode
   * Default: empty array (no selections)
   */
  selectedMultipleValuesWithConfirmation: any[] = [];
  
  /**
   * Required field value for validation demo
   * Default: null (no selection)
   */
  requiredValue: any = null;

  // ==================== ADVANCED DEMO VALUES ====================
  
  /**
   * Values for large dataset demo (50+ options)
   * Default: empty array
   */
  largeDatasetValue: any[] = [];
  
  /**
   * Value for disabled options demo
   * Default: null
   */
  disabledOptionsValue: any = null;
  
  /**
   * Value for country selection demo
   * Default: null
   */
  countryValue: any = null;
  
  /**
   * Values for category selection demo (multiple selection)
   * Default: empty array
   */
  categoryValue: any[] = [];

  // ==================== STATE DEMO VALUES ====================
  
  /**
   * Value for empty options demo
   * Default: null
   */
  emptyOptionsValue: any = null;
  
  /**
   * Pre-selected values for demo
   * Default: ['option1', 'option3']
   */
  preSelectedValue: any[] = ['option1', 'option3'];
  
  /**
   * Value for dynamic options demo
   * Default: null
   */
  dynamicValue: any = null;
  
  /**
   * Dynamic options array that can be modified at runtime
   * Default: 2 initial options
   */
  dynamicOptions: NxtDropdownOption[] = [
    { value: 'dynamic1', label: 'Dynamic Option 1' },
    { value: 'dynamic2', label: 'Dynamic Option 2' }
  ];

  // ==================== RESPONSIVE DEMO VALUES ====================
  
  /**
   * Values for responsive design demo
   * Default: empty array
   */
  responsiveValue: any[] = [];
  
  /**
   * Value for compact dropdown demo
   * Default: null
   */
  compactValue: any = null;
  
  /**
   * Value for wide dropdown demo
   * Default: null
   */
  wideValue: any = null;

  // ==================== PERFORMANCE DEMO VALUES ====================
  
  /**
   * Value for virtual scroll demo (1000+ options)
   * Default: null
   */
  virtualScrollValue: any = null;
  
  /**
   * Values for search performance demo (500 options)
   * Default: empty array
   */
  searchPerformanceValue: any[] = [];

  // ==================== SEARCH FUNCTIONALITY DEMO VALUES ====================
  
  /**
   * Value for searchable single selection demo
   * Default: null
   */
  searchableSingleValue: any = null;
  
  /**
   * Values for searchable multiple selection demo
   * Default: empty array
   */
  searchableMultipleValue: any[] = [];
  
  /**
   * Value for minimum search length demo
   * Default: null
   */
  searchMinLengthValue: any = null;
  
  /**
   * Values for searchable confirmation mode demo
   * Default: empty array
   */
  searchableConfirmationValue: any[] = [];

  // ==================== CONFIGURATION OBJECT DEMO VALUES ====================
  
  /**
   * Value for configuration-based single selection demo
   * Default: null
   */
  configBasedValue: any = null;
  
  /**
   * Values for configuration-based multiple selection demo
   * Default: empty array
   */
  configBasedMultipleValue: any[] = [];
  
  /**
   * Values for mixed configuration demo
   * Default: empty array
   */
  configBasedMixedValue: any[] = [];
  
  /**
   * Value for invalid mixed configuration demo
   * Default: null
   */
  invalidMixedValue: any = null;

  // ==================== CONTENT PROJECTION DEMO VALUES ====================
  
  /**
   * Value for content projection single selection demo
   * Default: null
   */
  contentProjectionValue: any = null;
  
  /**
   * Values for content projection multiple selection demo
   * Default: empty array
   */
  contentProjectionMultipleValue: any[] = [];
  
  /**
   * Value for content projection group demo
   * Default: null
   */
  contentProjectionGroupValue: any = null;
  
  /**
   * Values for content projection search demo
   * Default: empty array
   */
  contentProjectionSearchValue: any[] = [];

  // ==================== ICON TYPE DEMO VALUES ====================
  
  /**
   * Value for caret icon demo
   * Default: null
   */
  caretIconValue: any = null;
  
  /**
   * Value for arrow icon demo
   * Default: null
   */
  arrowIconValue: any = null;
  
  /**
   * Value for config-based icon demo
   * Default: null
   */
  configIconValue: any = null;
  
  /**
   * Value for sharp caret icon demo
   * Default: null
   */
  sharpCaretIconValue: any = null;
  
  /**
   * Value for inverted triangle icon demo
   * Default: null
   */
  invertedTriangleIconValue: any = null;

  // ==================== CUSTOM TRIGGER DEMO VALUES ====================
  
  /**
   * Value for custom trigger demo
   * Default: null
   */
  customTriggerValue: any = null;
  
  /**
   * Value for custom trigger with status demo
   * Default: null
   */
  customTriggerStatusValue: any = null;
  
  /**
   * Value for custom trigger without arrow demo
   * Default: null
   */
  customTriggerNoArrowValue: any = null;
  
  /**
   * Value for rich custom trigger demo
   * Default: null
   */
  customTriggerRichValue: any = null;

  // ==================== CUSTOM CONFIRMATION BUTTONS DEMO VALUES ====================
  
  /**
   * Values for custom confirmation buttons demo
   * Default: empty array
   */
  customConfirmationValue: any[] = [];
  
  /**
   * Values for custom confirmation buttons with icons demo
   * Default: empty array
   */
  customConfirmationWithIconsValue: any[] = [];

  // ==================== REACTIVE FORM ====================
  
  /**
   * Reactive form instance for form integration demos
   * Contains form controls for various dropdown configurations
   */
  reactiveForm: FormGroup;

  // ==================== SAMPLE OPTIONS ====================
  
  /**
   * Basic sample options for various demos
   * Contains 10 options with one disabled option
   */
  options: NxtDropdownOption[] = [
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

  // ==================== LARGE DATASET OPTIONS ====================
  
  /**
   * Large dataset options for performance testing (50 options)
   * Generated dynamically using Array.from
   */
  largeDatasetOptions: NxtDropdownOption[] = Array.from({ length: 50 }, (_, i) => ({
    value: `large${i + 1}`,
    label: `Large Dataset Option ${i + 1}`
  }));

  // ==================== OPTIONS WITH DISABLED ITEMS ====================
  
  /**
   * Options array with disabled items for accessibility demo
   * Contains both enabled and disabled options
   */
  optionsWithDisabled: NxtDropdownOption[] = [
    { value: 'enabled1', label: 'Enabled Option 1' },
    { value: 'disabled1', label: 'Disabled Option 1', disabled: true },
    { value: 'enabled2', label: 'Enabled Option 2' },
    { value: 'disabled2', label: 'Disabled Option 2', disabled: true },
    { value: 'enabled3', label: 'Enabled Option 3' }
  ];

  // ==================== COUNTRY OPTIONS ====================
  
  /**
   * Country options for real-world usage demo
   * Contains country codes and full country names
   */
  countryOptions: NxtDropdownOption[] = [
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

  // ==================== CATEGORY OPTIONS ====================
  
  /**
   * Category options for multiple selection demo
   * Contains various business categories
   */
  categoryOptions: NxtDropdownOption[] = [
    { value: 'tech', label: 'Technology' },
    { value: 'health', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'sports', label: 'Sports' },
    { value: 'travel', label: 'Travel' },
    { value: 'food', label: 'Food & Dining' }
  ];

  // ==================== VIRTUAL SCROLL OPTIONS ====================
  
  /**
   * Virtual scroll options for performance testing (1000+ items)
   * Generated dynamically using Array.from
   */
  virtualScrollOptions: NxtDropdownOption[] = Array.from({ length: 1000 }, (_, i) => ({
    value: `virtual${i + 1}`,
    label: `Virtual Option ${i + 1}`
  }));

  // ==================== SEARCH PERFORMANCE OPTIONS ====================
  
  /**
   * Search performance options for search functionality testing (500 items)
   * Generated dynamically using Array.from
   */
  searchPerformanceOptions: NxtDropdownOption[] = Array.from({ length: 500 }, (_, i) => ({
    value: `search${i + 1}`,
    label: `Search Option ${i + 1}`
  }));

  // ==================== CONFIGURATION OBJECTS FOR DEMO ====================
  
  /**
   * Configuration object for single selection demo
   * Demonstrates configuration-based setup with search functionality
   */
  singleSelectConfig: NxtDropdownConfig = {
    options: [
      { value: 'config1', label: 'Config Option 1' },
      { value: 'config2', label: 'Config Option 2' },
      { value: 'config3', label: 'Config Option 3' },
      { value: 'config4', label: 'Config Option 4' },
      { value: 'config5', label: 'Config Option 5' }
    ],
    placeholder: 'Select from config object',
    required: true,
    searchable: true,
    searchPlaceholder: 'Search config options...'
  };

  /**
   * Configuration object for multiple selection with confirmation demo
   * Demonstrates complex configuration with multiple features enabled
   */
  multipleSelectConfig: NxtDropdownConfig = {
    options: [
      { value: 'multi1', label: 'Multi Option 1' },
      { value: 'multi2', label: 'Multi Option 2' },
      { value: 'multi3', label: 'Multi Option 3' },
      { value: 'multi4', label: 'Multi Option 4' },
      { value: 'multi5', label: 'Multi Option 5' },
      { value: 'multi6', label: 'Multi Option 6' },
      { value: 'multi7', label: 'Multi Option 7' },
      { value: 'multi8', label: 'Multi Option 8' }
    ],
    placeholder: 'Select multiple from config',
    multiple: true,
    confirmation: true,
    searchable: true,
    searchPlaceholder: 'Search multi options...',
    minSearchLength: 1
  };

  // ==================== CONSTRUCTOR ====================
  
  /**
   * Constructor - initializes the reactive form with form controls
   * @param fb - FormBuilder service for creating reactive forms
   */
  constructor(private fb: FormBuilder) {
    this.reactiveForm = this.fb.group({
      singleSelect: ['', Validators.required],
      multipleSelect: [[], Validators.required],
      multipleSelectWithConfirmation: [[], Validators.required],
      country: ['', Validators.required]
    });
  }

  // ==================== LIFECYCLE METHODS ====================
  
  /**
   * Lifecycle hook called after component initialization
   * Logs configuration objects for debugging purposes
   */
  ngOnInit(): void {
    // Initialize any additional setup
    console.log('[Demo] singleSelectConfig:', this.singleSelectConfig);
    console.log('[Demo] multipleSelectConfig:', this.multipleSelectConfig);
  }

  // ==================== TAB MANAGEMENT METHODS ====================
  
  /**
   * Sets the active tab in the demo interface
   * @param tab - The tab to activate ('demo' or 'guide')
   */
  setActiveTab(tab: 'demo' | 'guide'): void {
    this.activeTab = tab;
  }

  // ==================== EVENT HANDLERS ====================
  
  /**
   * Handles selection change events from dropdown components
   * Logs the new value for debugging purposes
   * @param value - The new selected value(s)
   */
  onSelectionChange(value: any): void {
    console.log('Selection changed:', value);
  }

  // ==================== FORM METHODS ====================
  
  /**
   * Handles form submission
   * Validates the reactive form and shows success/error messages
   */
  onSubmit(): void {
    if (this.reactiveForm.valid) {
      alert('Form submitted successfully!');
      console.log('Form values:', this.reactiveForm.value);
    } else {
      alert('Please fill in all required fields.');
    }
  }

  /**
   * Resets all form values and demo state to initial values
   * Clears all selections and resets the reactive form
   */
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
    this.searchableSingleValue = null;
    this.searchableMultipleValue = [];
    this.searchMinLengthValue = null;
    this.searchableConfirmationValue = [];
    this.configBasedValue = null;
    this.configBasedMultipleValue = [];
    this.configBasedMixedValue = [];
    this.invalidMixedValue = null;
    this.contentProjectionValue = null;
    this.contentProjectionMultipleValue = [];
    this.contentProjectionGroupValue = null;
    this.contentProjectionSearchValue = [];
    this.caretIconValue = null;
    this.arrowIconValue = null;
    this.configIconValue = null;
    this.customTriggerValue = null;
    this.customTriggerStatusValue = null;
    this.customTriggerNoArrowValue = null;
    this.customTriggerRichValue = null;
  }

  /**
   * Fills the reactive form with sample values
   * Demonstrates programmatic form control
   */
  fillForm(): void {
    this.reactiveForm.patchValue({
      singleSelect: 'option1',
      multipleSelect: ['option1', 'option2'],
      multipleSelectWithConfirmation: ['option3', 'option4'],
      country: 'us'
    });
  }

  // ==================== DYNAMIC OPTIONS METHODS ====================
  
  /**
   * Adds a new dynamic option to the dynamicOptions array
   * Demonstrates runtime option modification
   */
  addDynamicOption(): void {
    const newIndex = this.dynamicOptions.length + 1;
    this.dynamicOptions.push({
      value: `dynamic${newIndex}`,
      label: `Dynamic Option ${newIndex}`
    });
  }

  /**
   * Removes the last dynamic option from the array
   * Ensures at least one option remains and clears selection if needed
   */
  removeDynamicOption(): void {
    if (this.dynamicOptions.length > 1) {
      this.dynamicOptions.pop();
      if (this.dynamicValue && !this.dynamicOptions.find(opt => opt.value === this.dynamicValue)) {
        this.dynamicValue = null;
      }
    }
  }

  // Infield Label Demo Values
  infieldLabelValue: any = null;
  customInfieldLabelValue: any = null;
  infieldLabelMultipleValue: any[] = [];
  infieldLabelConfigValue: any = null;
  infieldLabelSearchValue: any = null;
  infieldLabelConfirmationValue: any[] = [];
  aboveLabelValue: any = null;
  aboveLabelConfigValue: any = null;
  aboveLabelMultipleConfirmationValue: any[] = [];
} 
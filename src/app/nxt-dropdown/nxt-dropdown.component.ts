import { Component, forwardRef, Input, Output, EventEmitter, OnInit, HostListener, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface NxtDropdownOption {
  value: any;
  label: string;
  disabled?: boolean;
}

export interface NxtDropdownConfig {
  options?: NxtDropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  confirmation?: boolean;
  panelClass?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  minSearchLength?: number;
}

@Component({
  selector: 'nxt-dropdown',
  templateUrl: './nxt-dropdown.component.html',
  styleUrls: ['./nxt-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NxtDropdownComponent),
      multi: true
    }
  ]
})
export class NxtDropdownComponent implements ControlValueAccessor, OnInit, OnChanges {
  // Direct input properties (current way)
  @Input() options: NxtDropdownOption[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() multiple: boolean = false;
  @Input() confirmation: boolean = false;
  @Input() panelClass: string = '';
  @Input() searchable: boolean = false;
  @Input() searchPlaceholder: string = 'Search options...';
  @Input() minSearchLength: number = 0;

  // Configuration object input (new way)
  @Input() config: NxtDropdownConfig = {};
  
  // Strict configuration mode - when true, only config object is allowed
  @Input() strictConfigMode: boolean = false;

  @Output() selectionChange = new EventEmitter<any>();

  // Internal properties that will be used by the component
  private _options: NxtDropdownOption[] = [];
  private _placeholder: string = 'Select an option';
  private _disabled: boolean = false;
  private _required: boolean = false;
  private _multiple: boolean = false;
  private _confirmation: boolean = false;
  private _panelClass: string = '';
  private _searchable: boolean = false;
  private _searchPlaceholder: string = 'Search options...';
  private _minSearchLength: number = 0;

  value: any;
  isDisabled: boolean = false;
  isOpen: boolean = false;
  selectedOptions: NxtDropdownOption[] = [];
  pendingOptions: NxtDropdownOption[] = []; // For confirmation mode
  
  // Search functionality
  searchText: string = '';
  filteredOptions: NxtDropdownOption[] = [];
  showSearchInput: boolean = false;

  // ControlValueAccessor implementation
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.updateConfiguration();
    this.isDisabled = this._disabled;
    this.updateSelectedOptions();
    this.updateFilteredOptions();
    if (this._confirmation && this._multiple) {
      this.pendingOptions = [...this.selectedOptions];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Handle changes to both direct inputs and config object
    if (changes['config'] || changes['options'] || changes['placeholder'] || 
        changes['disabled'] || changes['required'] || changes['multiple'] || 
        changes['confirmation'] || changes['panelClass'] || changes['searchable'] || 
        changes['searchPlaceholder'] || changes['minSearchLength'] || changes['strictConfigMode']) {
      this.updateConfiguration();
      this.isDisabled = this._disabled;
      this.updateSelectedOptions();
      this.updateFilteredOptions();
    }
  }

  private updateConfiguration(): void {
    // Validate configuration approach if strict mode is enabled
    if (this.strictConfigMode) {
      this.validateStrictConfiguration();
    }

    // Apply configuration based on strict mode
    if (this.strictConfigMode) {
      // In strict mode, prioritize config object over direct inputs
      this._options = this.config.options || this.options || [];
      
      // Debug logging for configuration
      if (this.config.options && this.config.options.length > 0) {
        console.log('[NXT Dropdown] Config options loaded:', this.config.options);
      }
      this._placeholder = this.config.placeholder || this.placeholder || 'Select an option';
      this._disabled = this.config.disabled !== undefined ? this.config.disabled : (this.disabled || false);
      this._required = this.config.required !== undefined ? this.config.required : (this.required || false);
      this._multiple = this.config.multiple !== undefined ? this.config.multiple : (this.multiple || false);
      this._confirmation = this.config.confirmation !== undefined ? this.config.confirmation : (this.confirmation || false);
      this._panelClass = this.config.panelClass || this.panelClass || '';
      this._searchable = this.config.searchable !== undefined ? this.config.searchable : (this.searchable || false);
      this._searchPlaceholder = this.config.searchPlaceholder || this.searchPlaceholder || 'Search options...';
      this._minSearchLength = this.config.minSearchLength !== undefined ? this.config.minSearchLength : (this.minSearchLength || 0);
    } else {
      // In non-strict mode, direct inputs override config object
      this._options = this.options || this.config.options || [];
      
      // Debug logging for configuration
      if (this.config.options && this.config.options.length > 0) {
        console.log('[NXT Dropdown] Config options loaded (non-strict):', this.config.options);
      }
      
      // For non-strict mode, check if direct inputs are explicitly set
      // If not explicitly set, use config values
      this._placeholder = this.placeholder !== 'Select an option' ? this.placeholder : (this.config.placeholder || 'Select an option');
      this._disabled = this.disabled !== undefined ? this.disabled : (this.config.disabled || false);
      this._required = this.required !== undefined ? this.required : (this.config.required || false);
      this._multiple = this.multiple !== undefined ? this.multiple : (this.config.multiple || false);
      this._confirmation = this.confirmation !== undefined ? this.confirmation : (this.config.confirmation || false);
      this._panelClass = this.panelClass !== '' ? this.panelClass : (this.config.panelClass || '');
      this._searchable = this.searchable !== undefined ? this.searchable : (this.config.searchable || false);
      this._searchPlaceholder = this.searchPlaceholder !== 'Search options...' ? this.searchPlaceholder : (this.config.searchPlaceholder || 'Search options...');
      this._minSearchLength = this.minSearchLength !== undefined ? this.minSearchLength : (this.config.minSearchLength || 0);
    }
    
    // Debug logging for final options
    console.log('[NXT Dropdown] Final options:', this._options);
    console.log('[NXT Dropdown] Final placeholder:', this._placeholder);
    console.log('[NXT Dropdown] Final searchable:', this._searchable);
    console.log('[NXT Dropdown] Final searchPlaceholder:', this._searchPlaceholder);
  }

  private validateStrictConfiguration(): void {
    const hasDirectInputs = this.hasDirectInputs();
    const hasConfigObject = this.hasConfigObject();

    if (hasDirectInputs && hasConfigObject) {
      console.error(
        '%c[NXT Dropdown] Configuration Error:',
        'color: #d32f2f; font-weight: bold; font-size: 14px;'
      );
      console.error(
        '%cYou cannot mix direct input properties with config object when strictConfigMode is enabled.',
        'color: #d32f2f; font-size: 12px;'
      );
      console.error(
        '%cPlease use either:',
        'color: #1976d2; font-weight: bold; font-size: 12px;'
      );
      console.error(
        '%c1. Direct input properties only (strictConfigMode: false)',
        'color: #1976d2; font-size: 12px;'
      );
      console.error(
        '%c2. Config object only (strictConfigMode: true)',
        'color: #1976d2; font-size: 12px;'
      );
      console.error(
        '%cExample with config object:',
        'color: #1976d2; font-weight: bold; font-size: 12px;'
      );
      console.error(`
        <nxt-dropdown
          [strictConfigMode]="true"
          [config]="{
            options: myOptions,
            placeholder: 'Select option',
            multiple: true,
            searchable: true
          }"
          [(ngModel)]="selectedValue">
        </nxt-dropdown>
      `);
      console.error(
        '%cExample with direct properties:',
        'color: #1976d2; font-weight: bold; font-size: 12px;'
      );
      console.error(`
        <nxt-dropdown
          [strictConfigMode]="false"
          [options]="myOptions"
          [placeholder]="'Select option'"
          [multiple]="true"
          [searchable]="true"
          [(ngModel)]="selectedValue">
        </nxt-dropdown>
      `);
    }
  }

  private hasDirectInputs(): boolean {
    if (this.options.length > 0) return true;
    if (this.placeholder !== 'Select an option') return true;
    if (this.disabled === true) return true;
    if (this.required === true) return true;
    if (this.multiple === true) return true;
    if (this.confirmation === true) return true;
    if (this.panelClass !== '') return true;
    if (this.searchable === true) return true;
    if (this.searchPlaceholder !== 'Search options...') return true;
    if (this.minSearchLength !== 0) return true;
    return false;
  }

  private hasConfigObject(): boolean {
    if (!this.config || Object.keys(this.config).length === 0) {
      return false;
    }
    
    return !!(
      this.config.options ||
      this.config.placeholder ||
      this.config.disabled !== undefined ||
      this.config.required !== undefined ||
      this.config.multiple !== undefined ||
      this.config.confirmation !== undefined ||
      this.config.panelClass ||
      this.config.searchable !== undefined ||
      this.config.searchPlaceholder ||
      this.config.minSearchLength !== undefined
    );
  }

  // Getters for template access
  get currentOptions(): NxtDropdownOption[] {
    return this._options;
  }

  get currentPlaceholder(): string {
    return this._placeholder;
  }

  get currentDisabled(): boolean {
    return this._disabled;
  }

  get currentRequired(): boolean {
    return this._required;
  }

  get currentMultiple(): boolean {
    return this._multiple;
  }

  get currentConfirmation(): boolean {
    return this._confirmation;
  }

  get currentPanelClass(): string {
    return this._panelClass;
  }

  get currentSearchable(): boolean {
    return this._searchable;
  }

  get currentSearchPlaceholder(): string {
    return this._searchPlaceholder;
  }

  get currentMinSearchLength(): number {
    return this._minSearchLength;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  writeValue(value: any): void {
    this.value = value;
    this.updateSelectedOptions();
    
    // In confirmation mode, also update pending options to match selected options
    if (this._confirmation && this._multiple) {
      this.pendingOptions = [...this.selectedOptions];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  toggleDropdown(): void {
    if (!this.isDisabled) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.onTouched();
        if (this._searchable) {
          this.showSearchInput = true;
          // Focus search input after a short delay to ensure it's rendered
          setTimeout(() => {
            const searchInput = this.elementRef.nativeElement.querySelector('.nxt-dropdown-search-input');
            if (searchInput) {
              searchInput.focus();
            }
          }, 100);
        }
      } else {
        this.clearSearch();
      }
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.clearSearch();
  }

  // Search functionality methods
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchText = target.value;
    this.updateFilteredOptions();
  }

  onSearchKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeDropdown();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      // Select first filtered option if available
      const firstOption = this.filteredOptions.find(opt => !opt.disabled);
      if (firstOption) {
        this.selectOption(firstOption);
      }
    }
  }

  clearSearch(): void {
    this.searchText = '';
    this.showSearchInput = false;
    this.updateFilteredOptions();
  }

  updateFilteredOptions(): void {
    if (!this._searchable || !this.searchText || this.searchText.length < this._minSearchLength) {
      this.filteredOptions = [...this._options];
    } else {
      const searchLower = this.searchText.toLowerCase();
      this.filteredOptions = this._options.filter(option => 
        option.label.toLowerCase().includes(searchLower)
      );
    }
    
    // Debug logging for filtered options
    console.log('[NXT Dropdown] Filtered options:', this.filteredOptions);
    console.log('[NXT Dropdown] Search text:', this.searchText);
    console.log('[NXT Dropdown] Searchable:', this._searchable);
    console.log('[NXT Dropdown] Min search length:', this._minSearchLength);
  }

  selectOption(option: NxtDropdownOption): void {
    if (option.disabled) return;

    if (this._multiple) {
      if (this._confirmation) {
        this.togglePendingSelection(option);
      } else {
        this.toggleMultipleSelection(option);
      }
    } else {
      this.selectSingleOption(option);
    }
  }

  selectAll(): void {
    if (!this._multiple) return;

    if (this._confirmation) {
      this.togglePendingSelectAll();
    } else {
      this.toggleSelectAll();
    }
  }

  private toggleSelectAll(): void {
    const availableOptions = this.filteredOptions.filter(option => !option.disabled);
    const allSelected = availableOptions.every(option => 
      this.selectedOptions.some(selected => selected.value === option.value)
    );

    if (allSelected) {
      // Deselect all
      this.selectedOptions = [];
      this.value = [];
    } else {
      // Select all available options
      this.selectedOptions = [...availableOptions];
      this.value = availableOptions.map(opt => opt.value);
    }

    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
  }

  private togglePendingSelectAll(): void {
    const availableOptions = this.filteredOptions.filter(option => !option.disabled);
    const allSelected = availableOptions.every(option => 
      this.pendingOptions.some(selected => selected.value === option.value)
    );

    if (allSelected) {
      // Deselect all
      this.pendingOptions = [];
    } else {
      // Select all available options
      this.pendingOptions = [...availableOptions];
    }
  }

  private togglePendingSelection(option: NxtDropdownOption): void {
    const index = this.pendingOptions.findIndex(opt => opt.value === option.value);
    
    if (index > -1) {
      this.pendingOptions.splice(index, 1);
    } else {
      this.pendingOptions.push(option);
    }
  }

  isAllSelected(): boolean {
    if (!this._multiple) return false;
    
    const availableOptions = this.filteredOptions.filter(option => !option.disabled);
    const optionsToCheck = this._confirmation ? this.pendingOptions : this.selectedOptions;
    
    return availableOptions.length > 0 && 
           availableOptions.every(option => 
             optionsToCheck.some(selected => selected.value === option.value)
           );
  }

  isPartiallySelected(): boolean {
    if (!this._multiple) return false;
    
    const availableOptions = this.filteredOptions.filter(option => !option.disabled);
    const optionsToCheck = this._confirmation ? this.pendingOptions : this.selectedOptions;
    const selectedCount = availableOptions.filter(option => 
      optionsToCheck.some(selected => selected.value === option.value)
    ).length;
    
    return selectedCount > 0 && selectedCount < availableOptions.length;
  }

  private selectSingleOption(option: NxtDropdownOption): void {
    this.value = option.value;
    this.selectedOptions = [option];
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
    this.closeDropdown();
  }

  private toggleMultipleSelection(option: NxtDropdownOption): void {
    const index = this.selectedOptions.findIndex(opt => opt.value === option.value);
    
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      this.selectedOptions.push(option);
    }

    this.value = this.selectedOptions.map(opt => opt.value);
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
    
    // Close dropdown after selection in multiple mode (unless confirmation is enabled)
    if (!this._confirmation) {
      this.closeDropdown();
    }
  }

  private updateSelectedOptions(): void {
    if (!this.value) {
      this.selectedOptions = [];
      return;
    }

    if (this._multiple && Array.isArray(this.value)) {
      this.selectedOptions = this._options.filter(option => 
        this.value.includes(option.value)
      );
    } else {
      this.selectedOptions = this._options.filter(option => 
        option.value === this.value
      );
    }
  }

  getDisplayText(): string {
    if (this.selectedOptions.length === 0) {
      return this._placeholder;
    }

    if (this._multiple) {
      if (this.selectedOptions.length === 1) {
        return this.selectedOptions[0].label;
      }
      return this.selectedOptions.map(option => option.label).join(', ');
    }

    return this.selectedOptions[0].label;
  }

  getPendingDisplayText(): string {
    if (this.pendingOptions.length === 0) {
      return this._placeholder;
    }

    if (this._multiple) {
      if (this.pendingOptions.length === 1) {
        return this.pendingOptions[0].label;
      }
      return this.pendingOptions.map(option => option.label).join(', ');
    }

    return this.pendingOptions[0].label;
  }

  isOptionSelected(option: NxtDropdownOption): boolean {
    if (this._confirmation && this._multiple) {
      return this.pendingOptions.some(selected => selected.value === option.value);
    }
    return this.selectedOptions.some(selected => selected.value === option.value);
  }

  removeOption(event: Event, option: NxtDropdownOption): void {
    event.stopPropagation();
    
    if (this._confirmation && this._multiple) {
      // In confirmation mode, remove from pending options
      const index = this.pendingOptions.findIndex(opt => opt.value === option.value);
      if (index > -1) {
        this.pendingOptions.splice(index, 1);
      }
    } else {
      // Normal mode, toggle the option
      this.selectOption(option);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleDropdown();
        break;
      case 'Escape':
        this.closeDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.toggleDropdown();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen) {
          this.closeDropdown();
        }
        break;
    }
  }

  trackByValue(index: number, option: NxtDropdownOption): any {
    return option.value;
  }

  applySelection(): void {
    if (!this._confirmation || !this._multiple) return;

    this.selectedOptions = [...this.pendingOptions];
    this.value = this.selectedOptions.map(opt => opt.value);
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
    this.closeDropdown();
  }

  cancelSelection(): void {
    if (!this._confirmation || !this._multiple) return;

    // Reset pending options to match current selected options
    this.pendingOptions = [...this.selectedOptions];
    this.closeDropdown();
  }
} 
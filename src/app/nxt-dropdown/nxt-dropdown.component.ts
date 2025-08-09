import { Component, forwardRef, Input, Output, EventEmitter, OnInit, HostListener, ElementRef, OnChanges, SimpleChanges, ContentChildren, QueryList, AfterContentInit, ContentChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NxtOptionComponent } from './nxt-option.component';
import { NxtOptionGroupComponent } from './nxt-option-group.component';
import { NxtDropdownTriggerComponent } from './nxt-dropdown-trigger.component';

export interface NxtDropdownOption {
  value: any;
  label: string;
  disabled?: boolean;
  description?: string;
  group?: string;
  icon?: string;
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
  showDescriptions?: boolean;
  showGroups?: boolean;
  iconType?: 'caret' | 'arrow' | 'sharp-caret' | 'inverted-triangle';
  confirmationButtons?: {
    apply?: {
      text?: string;
      icon?: string;
    };
    cancel?: {
      text?: string;
      icon?: string;
    };
  };
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
export class NxtDropdownComponent implements ControlValueAccessor, OnInit, OnChanges, AfterContentInit {
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
  @Input() iconType: 'caret' | 'arrow' | 'sharp-caret' | 'inverted-triangle' = 'caret';
  
  // Confirmation button customization
  @Input() applyButtonText: string = 'Apply';
  @Input() applyButtonIcon: string = '';
  @Input() cancelButtonText: string = 'Cancel';
  @Input() cancelButtonIcon: string = '';

  // Configuration object input (new way)
  @Input() config: NxtDropdownConfig = {};
  
  // Strict configuration mode - when true, only config object is allowed
  @Input() strictConfigMode: boolean = false;

  @Output() selectionChange = new EventEmitter<any>();

  // Content projection support
  @ContentChildren(NxtOptionComponent) optionComponents?: QueryList<NxtOptionComponent>;
  @ContentChildren(NxtOptionGroupComponent) optionGroupComponents?: QueryList<NxtOptionGroupComponent>;
  @ContentChild(NxtDropdownTriggerComponent) customTrigger?: NxtDropdownTriggerComponent;

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
  private _iconType: 'caret' | 'arrow' | 'sharp-caret' | 'inverted-triangle' = 'caret';
  
  // Confirmation button customization
  private _applyButtonText: string = 'Apply';
  private _applyButtonIcon: string = '';
  private _cancelButtonText: string = 'Cancel';
  private _cancelButtonIcon: string = '';

  value: any;
  isDisabled: boolean = false;
  isOpen: boolean = false;
  selectedOptions: NxtDropdownOption[] = [];
  pendingOptions: NxtDropdownOption[] = []; // For confirmation mode
  
  // Store pending value when options are not yet available
  // This handles the case where writeValue is called before options are loaded
  private pendingValue: any = null;
  
  // Search functionality
  searchText: string = '';
  filteredOptions: NxtDropdownOption[] = [];
  showSearchInput: boolean = false;
  shouldPositionAbove: boolean = false;

  // ControlValueAccessor implementation
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.updateConfiguration();
    this.isDisabled = this._disabled;
    this.updateSelectedOptions();
    this.updateFilteredOptions();
    if (this._confirmation && this._multiple) {
      this.pendingOptions = [...this.selectedOptions];
    }
  }

  ngAfterContentInit() {
    // Process content projected options
    this.processContentProjectedOptions();
    
    // Subscribe to content changes
    if (this.optionComponents) {
      this.optionComponents.changes.subscribe(() => {
        this.processContentProjectedOptions();
      });
    }
    
    if (this.optionGroupComponents) {
      this.optionGroupComponents.changes.subscribe(() => {
        this.processContentProjectedOptions();
      });
    }

    // Setup custom trigger if provided
    this.setupCustomTrigger();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Handle changes to both direct inputs and config object
    if (changes['config'] || changes['options'] || changes['placeholder'] || 
        changes['disabled'] || changes['required'] || changes['multiple'] || 
        changes['confirmation'] || changes['panelClass'] || changes['searchable'] || 
        changes['searchPlaceholder'] || changes['minSearchLength'] || changes['iconType'] || changes['strictConfigMode']) {
      this.updateConfiguration();
      this.isDisabled = this._disabled;
      this.updateSelectedOptions();
      this.updateFilteredOptions();
    }
    
    // Process content projected options if they change
    if (changes['optionComponents'] || changes['optionGroupComponents']) {
      this.processContentProjectedOptions();
    }
  }

  private processContentProjectedOptions(): void {
    // If content projected options are available, use them instead of the options input
    if (this.optionComponents && this.optionComponents.length > 0) {
      const projectedOptions: NxtDropdownOption[] = [];
      
      // Process direct options
      this.optionComponents.forEach(optionComp => {
        projectedOptions.push({
          value: optionComp.value,
          label: optionComp.option.label,
          disabled: optionComp.disabled
        });
      });
      
      // Process grouped options
      if (this.optionGroupComponents) {
        this.optionGroupComponents.forEach(groupComp => {
          // For now, we'll handle groups by adding them as regular options
          // In a more advanced implementation, you might want to preserve the group structure
        });
      }
      
      // Update the options with projected content
      this._options = projectedOptions;
      this.updateFilteredOptions();
      
      // Check if we have a pending value now that options are available
      if (this._options && this._options.length > 0 && this.pendingValue !== null) {
        this.handlePendingValue();
      }
    }
  }

  private setupCustomTrigger(): void {
    if (this.customTrigger) {
      
      // Subscribe to trigger events
      this.customTrigger.triggerClick.subscribe((event: Event) => {
        this.toggleDropdown();
      });

      this.customTrigger.keyDown.subscribe((event: KeyboardEvent) => {
        this.onKeyDown(event);
      });

      // Update trigger properties
      this.updateTriggerProperties();
    } else {
    }
  }

  private updateTriggerProperties(): void {
    if (this.customTrigger) {
      this.customTrigger.disabled = this.isDisabled;
      this.customTrigger.isOpen = this.isOpen;
      this.customTrigger.required = this.currentRequired;
      this.customTrigger.multiple = this.currentMultiple;
      this.customTrigger.placeholder = this.currentPlaceholder;
      this.customTrigger.iconType = this.currentIconType;
    }
  }

  private updateConfiguration(): void {
    // Validate configuration approach if strict mode is enabled
    if (this.strictConfigMode) {
      this.validateStrictConfiguration();
    }

    // Store the previous options to check if they changed
    const previousOptions = this._options;

    // Apply configuration based on strict mode
    if (this.strictConfigMode) {
      // In strict mode, prioritize config object over direct inputs
      this._options = this.config.options || this.options || [];
      
      this._placeholder = this.config.placeholder || this.placeholder || 'Select an option';
      this._disabled = this.config.disabled !== undefined ? this.config.disabled : (this.disabled || false);
      this._required = this.config.required !== undefined ? this.config.required : (this.required || false);
      this._multiple = this.config.multiple !== undefined ? this.config.multiple : (this.multiple || false);
      this._confirmation = this.config.confirmation !== undefined ? this.config.confirmation : (this.confirmation || false);
      this._panelClass = this.config.panelClass || this.panelClass || '';
      this._searchable = this.config.searchable !== undefined ? this.config.searchable : (this.searchable || false);
      this._searchPlaceholder = this.config.searchPlaceholder || this.searchPlaceholder || 'Search options...';
      this._minSearchLength = this.config.minSearchLength !== undefined ? this.config.minSearchLength : (this.minSearchLength || 0);
      this._iconType = this.config.iconType || this.iconType || 'caret';
      
      // Confirmation button configuration
      this._applyButtonText = this.config.confirmationButtons?.apply?.text || this.applyButtonText || 'Apply';
      this._applyButtonIcon = this.config.confirmationButtons?.apply?.icon || this.applyButtonIcon || '';
      this._cancelButtonText = this.config.confirmationButtons?.cancel?.text || this.cancelButtonText || 'Cancel';
      this._cancelButtonIcon = this.config.confirmationButtons?.cancel?.icon || this.cancelButtonIcon || '';
    } else {
      // In non-strict mode, direct inputs override config object
      this._options = this.options || this.config.options || [];
      
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
      this._iconType = this.iconType !== 'caret' ? this.iconType : (this.config.iconType || 'caret');
      
      // Confirmation button configuration (non-strict mode)
      this._applyButtonText = this.applyButtonText !== 'Apply' ? this.applyButtonText : (this.config.confirmationButtons?.apply?.text || 'Apply');
      this._applyButtonIcon = this.applyButtonIcon !== '' ? this.applyButtonIcon : (this.config.confirmationButtons?.apply?.icon || '');
      this._cancelButtonText = this.cancelButtonText !== 'Cancel' ? this.cancelButtonText : (this.config.confirmationButtons?.cancel?.text || 'Cancel');
      this._cancelButtonIcon = this.cancelButtonIcon !== '' ? this.cancelButtonIcon : (this.config.confirmationButtons?.cancel?.icon || '');
    }

    // Check if options became available and we have a pending value
    if (this._options && this._options.length > 0 && this.pendingValue !== null) {
      this.handlePendingValue();
    }
  }

  private handlePendingValue(): void {
    // Apply the pending value now that options are available
    this.value = this.pendingValue;
    this.updateSelectedOptions();
    
    // In confirmation mode, also update pending options to match selected options
    if (this._confirmation && this._multiple) {
      this.pendingOptions = [...this.selectedOptions];
    }
    
    // Clear the pending value since we've processed it
    this.pendingValue = null;
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
    if (this.iconType !== 'caret') return true;
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
      this.config.minSearchLength !== undefined ||
      this.config.iconType !== undefined
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

  get currentIconType(): 'caret' | 'arrow' | 'sharp-caret' | 'inverted-triangle' {
    return this._iconType;
  }

  get currentApplyButtonText(): string {
    return this._applyButtonText;
  }

  get currentApplyButtonIcon(): string {
    return this._applyButtonIcon;
  }

  get currentCancelButtonText(): string {
    return this._cancelButtonText;
  }

  get currentCancelButtonIcon(): string {
    return this._cancelButtonIcon;
  }

  get hasCustomTrigger(): boolean {
    return !!this.customTrigger;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  writeValue(value: any): void {
    this.value = value;
    
    // If options are not available yet, store the value as pending
    // This handles the case where the form control value is set before the dropdown options are loaded
    if (!this._options || this._options.length === 0) {
      this.pendingValue = value;
      return;
    }
    
    // Clear pending value since we can now process it
    this.pendingValue = null;
    
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
    this.updateTriggerProperties();
  }

  toggleDropdown(): void {
    if (!this.isDisabled) {
      this.isOpen = !this.isOpen;
      this.updateTriggerProperties();
      
      if (this.isOpen) {
        this.calculateDropdownPosition();
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

  private calculateDropdownPosition(): void {
    const triggerElement = this.elementRef.nativeElement.querySelector('.nxt-dropdown-trigger');
    if (!triggerElement) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownMaxHeight = this.currentConfirmation ? 300 : 200; // Adjust based on confirmation mode
    const buffer = 0; // Additional buffer space as requested
    
    // Calculate available space below the trigger
    const spaceBelow = viewportHeight - triggerRect.bottom;
    
    // If there's not enough space below (max-height + buffer), position above
    this.shouldPositionAbove = spaceBelow < (dropdownMaxHeight + buffer);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.isOpen) {
      this.calculateDropdownPosition();
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.isOpen) {
      this.calculateDropdownPosition();
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.updateTriggerProperties();
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
    
    // Recalculate position if dropdown is open, as content height might have changed
    if (this.isOpen) {
      setTimeout(() => this.calculateDropdownPosition(), 0);
    }
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
    
    // Keep dropdown open for multiple selection to allow continuous selection
    // Only close for single selection or when confirmation is enabled
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

  /**
   * Sanitizes and returns the icon HTML for safe rendering
   * Supports both string icons (emoji, unicode) and HTML elements (font icons)
   */
  getSanitizedIcon(icon: string): SafeHtml {
    if (!icon) {
      return '';
    }
    
    // Check if the icon contains HTML tags (font icon)
    if (icon.includes('<') && icon.includes('>')) {
      return this.sanitizer.bypassSecurityTrustHtml(icon);
    }
    
    // For regular string icons (emoji, unicode), return as is
    return icon;
  }
} 
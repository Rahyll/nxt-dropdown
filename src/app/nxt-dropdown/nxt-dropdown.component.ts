import { Component, forwardRef, Input, Output, EventEmitter, OnInit, HostListener, ElementRef, OnChanges, SimpleChanges, ContentChildren, QueryList, AfterContentInit, ContentChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NxtOptionComponent } from './nxt-option.component';
import { NxtOptionGroupComponent } from './nxt-option-group.component';
import { NxtDropdownTriggerComponent } from './nxt-dropdown-trigger.component';
import { NxtDropdownOption, NxtDropdownConfig } from './interfaces';
import { 
  filterOptionsBySearch,
  clearSearchState,
  findFirstAvailableOption
} from './utils/search.utils';
import {
  isAllSelected,
  isPartiallySelected,
  isOptionSelected,
  updateSelectedOptions,
  toggleOptionSelection,
  getValuesFromSelectedOptions
} from './utils/selection.utils';
import {
  getDisplayText,
  getPendingDisplayText
} from './utils/display.utils';
import {
  validateStrictConfiguration,
  mergeConfiguration
} from './utils/config.utils';
import {
  getSanitizedIcon,
  trackByValue,
  handleDropdownKeyDown,
  handleSearchKeyDown
} from './utils/ui.utils';

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
  
  // Search functionality
  searchText: string = '';
  filteredOptions: NxtDropdownOption[] = [];
  showSearchInput: boolean = false;

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
    }
  }

  private setupCustomTrigger(): void {
    if (this.customTrigger) {
      console.log('[NXT Dropdown] Setting up custom trigger');
      
      // Subscribe to trigger events
      this.customTrigger.triggerClick.subscribe((event: Event) => {
        console.log('[NXT Dropdown] Custom trigger clicked, toggling dropdown');
        this.toggleDropdown();
      });

      this.customTrigger.keyDown.subscribe((event: KeyboardEvent) => {
        console.log('[NXT Dropdown] Custom trigger keydown');
        this.onKeyDown(event);
      });

      // Update trigger properties
      this.updateTriggerProperties();
    } else {
      console.log('[NXT Dropdown] No custom trigger found');
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
      this._iconType = this.config.iconType || this.iconType || 'caret';
      
      // Confirmation button configuration
      this._applyButtonText = this.config.confirmationButtons?.apply?.text || this.applyButtonText || 'Apply';
      this._applyButtonIcon = this.config.confirmationButtons?.apply?.icon || this.applyButtonIcon || '';
      this._cancelButtonText = this.config.confirmationButtons?.cancel?.text || this.cancelButtonText || 'Cancel';
      this._cancelButtonIcon = this.config.confirmationButtons?.cancel?.icon || this.cancelButtonIcon || '';
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
      this._iconType = this.iconType !== 'caret' ? this.iconType : (this.config.iconType || 'caret');
      
      // Confirmation button configuration (non-strict mode)
      this._applyButtonText = this.applyButtonText !== 'Apply' ? this.applyButtonText : (this.config.confirmationButtons?.apply?.text || 'Apply');
      this._applyButtonIcon = this.applyButtonIcon !== '' ? this.applyButtonIcon : (this.config.confirmationButtons?.apply?.icon || '');
      this._cancelButtonText = this.cancelButtonText !== 'Cancel' ? this.cancelButtonText : (this.config.confirmationButtons?.cancel?.text || 'Cancel');
      this._cancelButtonIcon = this.cancelButtonIcon !== '' ? this.cancelButtonIcon : (this.config.confirmationButtons?.cancel?.icon || '');
    }
    
    // Debug logging for final options
    console.log('[NXT Dropdown] Final options:', this._options);
    console.log('[NXT Dropdown] Final placeholder:', this._placeholder);
    console.log('[NXT Dropdown] Final searchable:', this._searchable);
    console.log('[NXT Dropdown] Final searchPlaceholder:', this._searchPlaceholder);
  }

  private validateStrictConfiguration(): void {
    const validation = validateStrictConfiguration(
      this.config,
      {
        options: this.options,
        placeholder: this.placeholder,
        disabled: this.disabled,
        required: this.required,
        multiple: this.multiple,
        confirmation: this.confirmation,
        panelClass: this.panelClass,
        searchable: this.searchable,
        searchPlaceholder: this.searchPlaceholder,
        minSearchLength: this.minSearchLength,
        iconType: this.iconType
      },
      this.strictConfigMode
    );

    if (!validation.isValid) {
      console.error('[NXT Dropdown] Configuration Error:', validation.errorMessage);
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
    console.log('[NXT Dropdown] toggleDropdown called, isDisabled:', this.isDisabled);
    if (!this.isDisabled) {
      this.isOpen = !this.isOpen;
      console.log('[NXT Dropdown] Dropdown isOpen:', this.isOpen);
      this.updateTriggerProperties();
      
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
    handleSearchKeyDown(event, {
      closeDropdown: () => this.closeDropdown(),
      selectFirstOption: () => {
        const firstOption = findFirstAvailableOption(this.filteredOptions);
        if (firstOption) {
          this.selectOption(firstOption);
        }
      }
    });
  }

  clearSearch(): void {
    const clearedState = clearSearchState();
    this.searchText = clearedState.searchText;
    this.showSearchInput = clearedState.showSearchInput;
    this.updateFilteredOptions();
  }

  updateFilteredOptions(): void {
    this.filteredOptions = filterOptionsBySearch(
      this._options,
      this.searchText,
      this._searchable,
      this._minSearchLength
    );
    
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
    return isAllSelected(this.filteredOptions, this.selectedOptions, this._multiple);
  }

  isPartiallySelected(): boolean {
    return isPartiallySelected(this.filteredOptions, this.selectedOptions, this._multiple);
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
    this.selectedOptions = updateSelectedOptions(this.value, this._options, this._multiple);
  }

  getDisplayText(): string {
    return getDisplayText(this.selectedOptions, this._placeholder, this._multiple);
  }

  getPendingDisplayText(): string {
    return getPendingDisplayText(this.pendingOptions, this._placeholder, this._multiple);
  }

  isOptionSelected(option: NxtDropdownOption): boolean {
    const optionsToCheck = this._confirmation && this._multiple ? this.pendingOptions : this.selectedOptions;
    return isOptionSelected(option, optionsToCheck);
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
    handleDropdownKeyDown(event, this.isDisabled, this.isOpen, {
      toggleDropdown: () => this.toggleDropdown(),
      closeDropdown: () => this.closeDropdown()
    });
  }

  trackByValue(index: number, option: NxtDropdownOption): any {
    return trackByValue(index, option);
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
    return getSanitizedIcon(icon, this.sanitizer);
  }
} 
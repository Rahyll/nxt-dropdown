import { Component, forwardRef, Input, Output, EventEmitter, OnInit, HostListener, ElementRef, OnChanges, SimpleChanges, ContentChildren, QueryList, AfterContentInit, ContentChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NxtOptionComponent } from './components/nxt-option/nxt-option.component';
import { NxtOptionGroupComponent } from './components/nxt-option-group/nxt-option-group.component';
import { NxtDropdownTriggerComponent } from './components/nxt-dropdown-trigger/nxt-dropdown-trigger.component';
import { NxtDropdownConfig, NxtDropdownOption } from './interfaces/nxt-dropdown.interfaces';
import { validateStrictConfiguration, mergeConfiguration, hasDirectInputValues, hasConfigValues } from './utils/config.utils';
import { isAllSelected, isPartiallySelected, isOptionSelected, updateSelectedOptions, getValuesFromSelectedOptions, toggleOptionSelection } from './utils/selection.utils';
import { getDisplayText, getPendingDisplayText } from './utils/display.utils';
import { filterOptionsBySearch, clearSearchState } from './utils/search.utils';
import { getSanitizedIcon, trackByValue, handleDropdownKeyDown, handleSearchKeyDown } from './utils/ui.utils';

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
    // Process content projected options with a small delay to ensure all components are initialized
    setTimeout(() => {
      this.processContentProjectedOptions();
    });
    
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
    const hasDirectOptions = this.optionComponents && this.optionComponents.length > 0;
    const hasGroupedOptions = this.optionGroupComponents && this.optionGroupComponents.length > 0;
    
    if (hasDirectOptions || hasGroupedOptions) {
      const projectedOptions: NxtDropdownOption[] = [];
      
      // Process direct options
      if (hasDirectOptions) {
        this.optionComponents!.forEach(optionComp => {
          projectedOptions.push({
            value: optionComp.value,
            label: optionComp.option.label,
            disabled: optionComp.disabled
          });
        });
      }
      
      // Process grouped options
      if (hasGroupedOptions) {
        this.optionGroupComponents!.forEach(groupComp => {
          // Get options from each group component
          const groupOptions = groupComp.getOptions();
          projectedOptions.push(...groupOptions);
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
    if (!this.customTrigger) return;
    
    // Subscribe to trigger events
    this.customTrigger.triggerClick.subscribe((event: Event) => {
      this.toggleDropdown();
    });

    this.customTrigger.keyDown.subscribe((event: KeyboardEvent) => {
      this.onKeyDown(event);
    });

    // Update trigger properties
    this.updateTriggerProperties();
  }

  private updateTriggerProperties(): void {
    if (!this.customTrigger) return;
    
    this.customTrigger.disabled = this.isDisabled;
    this.customTrigger.isOpen = this.isOpen;
    this.customTrigger.required = this.currentRequired;
    this.customTrigger.multiple = this.currentMultiple;
    this.customTrigger.placeholder = this.currentPlaceholder;
    this.customTrigger.iconType = this.currentIconType;
  }

  private updateConfiguration(): void {
    const directInputs = {
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
      iconType: this.iconType,
      applyButtonText: this.applyButtonText,
      applyButtonIcon: this.applyButtonIcon,
      cancelButtonText: this.cancelButtonText,
      cancelButtonIcon: this.cancelButtonIcon
    };

    // Validate configuration
    const validation = validateStrictConfiguration(this.config, directInputs, this.strictConfigMode);
    if (!validation.isValid) {
      console.error('[NXT Dropdown] Configuration Error:', validation.errorMessage);
      return;
    }

    // Merge configuration
    const mergedConfig = mergeConfiguration(this.config, directInputs, this.strictConfigMode);
    
    // Apply merged configuration
    this._options = mergedConfig.options;
    this._placeholder = mergedConfig.placeholder;
    this._disabled = mergedConfig.disabled;
    this._required = mergedConfig.required;
    this._multiple = mergedConfig.multiple;
    this._confirmation = mergedConfig.confirmation;
    this._panelClass = mergedConfig.panelClass;
    this._searchable = mergedConfig.searchable;
    this._searchPlaceholder = mergedConfig.searchPlaceholder;
    this._minSearchLength = mergedConfig.minSearchLength;
    this._iconType = mergedConfig.iconType;
    
    // Handle confirmation buttons
    this._applyButtonText = this.config.confirmationButtons?.apply?.text || this.applyButtonText || 'Apply';
    this._applyButtonIcon = this.config.confirmationButtons?.apply?.icon || this.applyButtonIcon || '';
    this._cancelButtonText = this.config.confirmationButtons?.cancel?.text || this.cancelButtonText || 'Cancel';
    this._cancelButtonIcon = this.config.confirmationButtons?.cancel?.icon || this.cancelButtonIcon || '';

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
    handleSearchKeyDown(event, {
      closeDropdown: () => this.closeDropdown(),
      selectFirstOption: () => {
        const firstOption = this.filteredOptions.find(opt => !opt.disabled);
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
    this.filteredOptions = filterOptionsBySearch(this._options, this.searchText, this._searchable, this._minSearchLength);
    
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
    return isAllSelected(this.filteredOptions, this._confirmation ? this.pendingOptions : this.selectedOptions, this._multiple);
  }

  isPartiallySelected(): boolean {
    return isPartiallySelected(this.filteredOptions, this._confirmation ? this.pendingOptions : this.selectedOptions, this._multiple);
  }

  isOptionSelected(option: NxtDropdownOption): boolean {
    const optionsToCheck = this._confirmation && this._multiple ? this.pendingOptions : this.selectedOptions;
    return isOptionSelected(option, optionsToCheck);
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
    this.selectedOptions = toggleOptionSelection(option, this.selectedOptions);
    this.value = getValuesFromSelectedOptions(this.selectedOptions, this._multiple);
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
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

  shouldShowGroupHeader(option: NxtDropdownOption, index: number): boolean {
    if (!option.group) {
      return false;
    }
    
    // Show group header if this is the first option with this group
    for (let i = 0; i < index; i++) {
      if (this.filteredOptions[i].group === option.group) {
        return false;
      }
    }
    
    return true;
  }

  applySelection(): void {
    if (!this._confirmation || !this._multiple) return;

    this.selectedOptions = [...this.pendingOptions];
    this.value = getValuesFromSelectedOptions(this.selectedOptions, this._multiple);
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
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
  // Direct input properties
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

  // Configuration object input
  @Input() config: NxtDropdownConfig = {};
  
  // Strict configuration mode - when true, only config object is allowed
  @Input() strictConfigMode: boolean = false;

  @Output() selectionChange = new EventEmitter<any>();

  // Content projection support
  @ContentChildren(NxtOptionComponent) optionComponents?: QueryList<NxtOptionComponent>;
  @ContentChildren(NxtOptionGroupComponent) optionGroupComponents?: QueryList<NxtOptionGroupComponent>;
  @ContentChild(NxtDropdownTriggerComponent) customTrigger?: NxtDropdownTriggerComponent;

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
    this.isDisabled = this.disabled;
    this.updateSelectedOptions();
    this.updateFilteredOptions();
    if (this.confirmation && this.multiple) {
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
      this.isDisabled = this.disabled;
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
      this.options = projectedOptions;
      this.updateFilteredOptions();
      
      // Check if we have a pending value now that options are available
      if (this.options && this.options.length > 0 && this.pendingValue !== null) {
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
    this.customTrigger.required = this.required;
    this.customTrigger.multiple = this.multiple;
    this.customTrigger.placeholder = this.placeholder;
    this.customTrigger.iconType = this.iconType;
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
    
    // Apply merged configuration directly to input properties
    Object.assign(this, mergedConfig);
    
    // Handle confirmation buttons
    this.applyButtonText = this.config.confirmationButtons?.apply?.text || this.applyButtonText || 'Apply';
    this.applyButtonIcon = this.config.confirmationButtons?.apply?.icon || this.applyButtonIcon || '';
    this.cancelButtonText = this.config.confirmationButtons?.cancel?.text || this.cancelButtonText || 'Cancel';
    this.cancelButtonIcon = this.config.confirmationButtons?.cancel?.icon || this.cancelButtonIcon || '';

    // Check if options became available and we have a pending value
    if (this.options && this.options.length > 0 && this.pendingValue !== null) {
      this.handlePendingValue();
    }
  }

  private handlePendingValue(): void {
    // Apply the pending value now that options are available
    this.value = this.pendingValue;
    this.updateSelectedOptions();
    
    // In confirmation mode, also update pending options to match selected options
    if (this.confirmation && this.multiple) {
      this.pendingOptions = [...this.selectedOptions];
    }
    
    // Clear the pending value since we've processed it
    this.pendingValue = null;
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
    if (!this.options || this.options.length === 0) {
      this.pendingValue = value;
      return;
    }
    
    // Clear pending value since we can now process it
    this.pendingValue = null;
    
    this.updateSelectedOptions();
    
    // In confirmation mode, also update pending options to match selected options
    if (this.confirmation && this.multiple) {
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
        if (this.searchable) {
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
    const dropdownMaxHeight = this.confirmation ? 300 : 200; // Adjust based on confirmation mode
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
    this.filteredOptions = filterOptionsBySearch(this.options, this.searchText, this.searchable, this.minSearchLength);
    
    // Recalculate position if dropdown is open, as content height might have changed
    if (this.isOpen) {
      setTimeout(() => this.calculateDropdownPosition(), 0);
    }
  }

  selectOption(option: NxtDropdownOption): void {
    if (option.disabled) return;

    if (this.multiple) {
      if (this.confirmation) {
        this.togglePendingSelection(option);
      } else {
        this.toggleMultipleSelection(option);
      }
    } else {
      this.selectSingleOption(option);
    }
  }

  selectAll(): void {
    if (!this.multiple) return;

    if (this.confirmation) {
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
    return isAllSelected(this.filteredOptions, this.confirmation ? this.pendingOptions : this.selectedOptions, this.multiple);
  }

  isPartiallySelected(): boolean {
    return isPartiallySelected(this.filteredOptions, this.confirmation ? this.pendingOptions : this.selectedOptions, this.multiple);
  }

  isOptionSelected(option: NxtDropdownOption): boolean {
    const optionsToCheck = this.confirmation && this.multiple ? this.pendingOptions : this.selectedOptions;
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
    this.value = getValuesFromSelectedOptions(this.selectedOptions, this.multiple);
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
  }

  private updateSelectedOptions(): void {
    this.selectedOptions = updateSelectedOptions(this.value, this.options, this.multiple);
  }

  getDisplayText(): string {
    return getDisplayText(this.selectedOptions, this.placeholder, this.multiple);
  }

  getPendingDisplayText(): string {
    return getPendingDisplayText(this.pendingOptions, this.placeholder, this.multiple);
  }

  removeOption(event: Event, option: NxtDropdownOption): void {
    event.stopPropagation();
    
    if (this.confirmation && this.multiple) {
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
    if (!this.confirmation || !this.multiple) return;

    this.selectedOptions = [...this.pendingOptions];
    this.value = getValuesFromSelectedOptions(this.selectedOptions, this.multiple);
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
    this.closeDropdown();
  }

  cancelSelection(): void {
    if (!this.confirmation || !this.multiple) return;

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
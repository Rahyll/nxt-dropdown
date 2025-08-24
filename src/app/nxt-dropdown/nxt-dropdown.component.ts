/**
 * Main Dropdown Component
 * 
 * This component provides a comprehensive dropdown/select functionality with the following features:
 * - Single and multiple selection modes
 * - Search functionality with configurable minimum search length
 * - Confirmation mode for multiple selections
 * - Content projection support for custom options and triggers
 * - Form integration via ControlValueAccessor
 * - Keyboard navigation support
 * - Responsive positioning (above/below trigger)
 * - Customizable icons and styling
 * - Strict configuration mode for validation
 */
import { Component, forwardRef, Input, Output, EventEmitter, OnInit, HostListener, ElementRef, OnChanges, SimpleChanges, ContentChildren, QueryList, AfterContentInit, ContentChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NxtOptionComponent } from './components/nxt-option/nxt-option.component';
import { NxtOptionGroupComponent } from './components/nxt-option-group/nxt-option-group.component';
import { NxtDropdownTriggerComponent } from './components/nxt-dropdown-trigger/nxt-dropdown-trigger.component';
import { NxtDropdownConfig, NxtDropdownOption, NxtDropdownState, NxtDropdownBasicConfig, NxtDropdownSelectionConfig, NxtDropdownSearchConfig, NxtDropdownLabelConfig, NxtDropdownIconConfig, NxtDropdownConfirmationConfig } from './interfaces/nxt-dropdown.interfaces';
import { validateStrictConfiguration, mergeConfiguration, hasValues, mergeGroupedConfigurations, extractGroupedConfigurations, validateConfiguration } from './utils/config.utils';
import { isAllSelected, isPartiallySelected, isOptionSelected, updateSelectedOptions, getValuesFromSelectedOptions, toggleOptionSelection } from './utils/selection.utils';
import { getDisplayText, getPendingDisplayText } from './utils/display.utils';
import { filterOptionsBySearch, clearSearchState } from './utils/search.utils';
import { getSanitizedIcon, trackByValue, handleDropdownKeyDown, handleSearchKeyDown } from './utils/ui.utils';

/**
 * Component decorator with metadata
 * - selector: Custom HTML tag for the component
 * - templateUrl: Path to the HTML template
 * - styleUrls: Array of CSS files for styling
 * - providers: Array of dependency injection providers
 *   - NG_VALUE_ACCESSOR: Enables form integration by providing ControlValueAccessor implementation
 *   - forwardRef: Resolves circular dependency by deferring the class reference
 *   - multi: true: Allows multiple providers for the same token
 */
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
  
  // ==================== INPUT PROPERTIES ====================
  
  /**
   * Array of options to display in the dropdown
   * Each option should have value, label, and optional disabled property
   */
  @Input() options: NxtDropdownOption[] = [];
  
  /**
   * Placeholder text shown when no option is selected
   * Default: 'Select an option'
   */
  @Input() placeholder: string = 'Select an option';
  
  /**
   * Whether the dropdown is disabled and cannot be interacted with
   * Default: false
   */
  @Input() disabled: boolean = false;
  
  /**
   * Whether the dropdown is required (for form validation)
   * Default: false
   */
  @Input() required: boolean = false;
  
  /**
   * Whether multiple options can be selected
   * Default: false (single selection mode)
   */
  @Input() multiple: boolean = false;
  
  /**
   * Whether to show confirmation buttons for multiple selections
   * Only applies when multiple is true
   * Default: false
   */
  @Input() confirmation: boolean = false;
  
  /**
   * CSS class to apply to the dropdown panel for custom styling
   * Default: empty string
   */
  @Input() panelClass: string = '';
  
  /**
   * Whether to show a search input for filtering options
   * Default: false
   */
  @Input() searchable: boolean = false;
  
  /**
   * Placeholder text for the search input
   * Default: 'Search options...'
   */
  @Input() searchPlaceholder: string = 'Search options...';
  
  /**
   * Minimum number of characters required before search filtering begins
   * Default: 0 (search starts immediately)
   */
  @Input() minSearchLength: number = 0;
  
  /**
   * Type of icon to display in the dropdown trigger
   * Options: 'caret', 'arrow', 'sharp-caret', 'inverted-triangle'
   * Default: 'caret'
   */
  @Input() iconType: 'caret' | 'arrow' | 'sharp-caret' | 'inverted-triangle' = 'caret';
  
  // ==================== CONFIRMATION BUTTON CUSTOMIZATION ====================
  
  /**
   * Text for the apply button in confirmation mode
   * Default: 'Apply'
   */
  @Input() applyButtonText: string = 'Apply';
  
  /**
   * Icon for the apply button (can be emoji, unicode, or HTML)
   * Default: empty string
   */
  @Input() applyButtonIcon: string = '';
  
  /**
   * Text for the cancel button in confirmation mode
   * Default: 'Cancel'
   */
  @Input() cancelButtonText: string = 'Cancel';
  
  /**
   * Icon for the cancel button (can be emoji, unicode, or HTML)
   * Default: empty string
   */
  @Input() cancelButtonIcon: string = '';

  // ==================== INFIELD LABEL FEATURE ====================
  
  /**
   * Whether to use infield label mode instead of regular dropdown
   * When true, the label appears inside the field and animates when focused/selected
   * Default: false
   */
  @Input() infieldLabel: boolean = false;
  
  /**
   * Label text to display in infield label mode
   * If not provided, uses the placeholder text
   * Default: empty string (falls back to placeholder)
   */
  @Input() infieldLabelText: string = '';
  
  /**
   * Position of the infield label
   * 'infield': Label appears inside the field and animates when focused/selected
   * 'onfield': Label appears on the field as a static label
   * Default: 'infield'
   */
  @Input() infieldLabelPosition: 'infield' | 'onfield' = 'infield';

  /**
   * Whether to hide the dropdown value display when no option is selected
   * When true, the placeholder and selected content are hidden when no selection is made
   * Default: false
   */
  @Input() floatlabel: boolean = false;

  /**
   * Position of the floating label when active
   * 'infield': Label appears inside the field and animates when focused/selected
   * 'onfield': Label appears on the field as a static label
   * Default: 'infield'
   */
  @Input() floatlabelPosition: 'infield' | 'onfield' = 'infield';

  /**
   * Text for the floating label
   * If not provided, uses the placeholder text
   * Default: empty string (falls back to placeholder)
   */
  @Input() floatlabelText: string = '';

  // ==================== CONFIGURATION OBJECT INPUT ====================
  
  /**
   * Configuration object that can override individual input properties
   * Provides a centralized way to configure the dropdown
   * Default: empty object
   */
  @Input() config: NxtDropdownConfig = {};
  
  /**
   * When true, only the config object is allowed and direct inputs are ignored
   * Provides strict validation to prevent mixed configuration approaches
   * Default: false
   */
  @Input() strictConfigMode: boolean = false;

  // ==================== OUTPUT EVENTS ====================
  
  /**
   * Event emitted when the selection changes
   * Emits the selected value(s) to parent components
   */
  @Output() selectionChange = new EventEmitter<any>();

  // ==================== CONTENT PROJECTION SUPPORT ====================
  
  /**
   * Query list of projected nxt-option components
   * Allows users to define options using content projection instead of the options input
   */
  @ContentChildren(NxtOptionComponent) optionComponents?: QueryList<NxtOptionComponent>;
  
  /**
   * Query list of projected nxt-option-group components
   * Allows users to group options using content projection
   */
  @ContentChildren(NxtOptionGroupComponent) optionGroupComponents?: QueryList<NxtOptionGroupComponent>;
  
  /**
   * Single projected nxt-dropdown-trigger component
   * Allows users to provide a custom trigger element
   */
  @ContentChild(NxtDropdownTriggerComponent) customTrigger?: NxtDropdownTriggerComponent;

  // ==================== CONSOLIDATED STATE MANAGEMENT ====================
  
  /**
   * Consolidated state object containing all internal state properties
   * This reduces redundancy and improves state management
   */
  private state: NxtDropdownState = {
    value: null,
    isDisabled: false,
    isOpen: false,
    selectedOptions: [],
    pendingOptions: [],
    searchText: '',
    filteredOptions: [],
    showSearchInput: false,
    shouldPositionAbove: false,
    pendingValue: null
  };

  // ==================== STATE GETTERS ====================
  
  get value(): any { return this.state.value; }
  get isDisabled(): boolean { return this.state.isDisabled; }
  get isOpen(): boolean { return this.state.isOpen; }
  get selectedOptions(): NxtDropdownOption[] { return this.state.selectedOptions; }
  get pendingOptions(): NxtDropdownOption[] { return this.state.pendingOptions; }
  get searchText(): string { return this.state.searchText; }
  get filteredOptions(): NxtDropdownOption[] { return this.state.filteredOptions; }
  get showSearchInput(): boolean { return this.state.showSearchInput; }
  get shouldPositionAbove(): boolean { return this.state.shouldPositionAbove; }
  get pendingValue(): any { return this.state.pendingValue; }

  // ==================== STATE UPDATE METHODS ====================
  
  /**
   * Update state with partial updates
   * @param updates - Partial state updates
   */
  private updateState(updates: Partial<NxtDropdownState>): void {
    this.state = { ...this.state, ...updates };
  }

  /**
   * Update specific state properties
   */
  private setValue(value: any): void { this.updateState({ value }); }
  private setIsDisabled(isDisabled: boolean): void { this.updateState({ isDisabled }); }
  private setIsOpen(isOpen: boolean): void { this.updateState({ isOpen }); }
  private setSelectedOptions(selectedOptions: NxtDropdownOption[]): void { this.updateState({ selectedOptions }); }
  private setPendingOptions(pendingOptions: NxtDropdownOption[]): void { this.updateState({ pendingOptions }); }
  private setSearchText(searchText: string): void { this.updateState({ searchText }); }
  private setFilteredOptions(filteredOptions: NxtDropdownOption[]): void { this.updateState({ filteredOptions }); }
  private setShowSearchInput(showSearchInput: boolean): void { this.updateState({ showSearchInput }); }
  private setShouldPositionAbove(shouldPositionAbove: boolean): void { this.updateState({ shouldPositionAbove }); }
  private setPendingValue(pendingValue: any): void { this.updateState({ pendingValue }); }

  // ==================== CONTROL VALUE ACCESSOR IMPLEMENTATION ====================
  
  /**
   * Callback function provided by Angular forms to handle value changes
   * Called whenever the internal value changes
   */
  private onChange = (value: any) => {};
  
  /**
   * Callback function provided by Angular forms to handle touch events
   * Called when the user interacts with the dropdown
   */
  private onTouched = () => {};

  /**
   * Constructor - initializes dependencies
   * @param elementRef - Reference to the component's DOM element for positioning calculations
   * @param sanitizer - Service for sanitizing HTML content (used for icons)
   */
  constructor(
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer
  ) {}

  // ==================== PRIVATE HELPER METHODS ====================

  /**
   * Resets pending options to match current selected options in confirmation mode
   * This eliminates the repeated logic for resetting pending options
   */
  private resetPendingOptions(): void {
    if (this.confirmation && this.multiple) {
      this.setPendingOptions([...this.selectedOptions]);
    }
  }

  /**
   * Updates all internal state properties after configuration changes
   * Consolidates the common pattern of updating disabled state, selected options, and filtered options
   */
  private updateInternalState(): void {
    this.setIsDisabled(this.disabled);
    this.updateSelectedOptions();
    this.updateFilteredOptions();
  }

  /**
   * Checks if there's a pending value and handles it when options are available
   * Consolidates the repeated logic for checking and processing pending values
   */
  private checkAndHandlePendingValue(): void {
    if (this.options && this.options.length > 0 && this.pendingValue !== null) {
      this.handlePendingValue();
    }
  }

  /**
   * Lifecycle hook called after data-bound properties are initialized
   * Sets up initial state and configuration
   */
  ngOnInit() {
    // Update configuration by merging config object with direct inputs
    this.updateConfiguration();
    
    // Update all internal state
    this.updateInternalState();
    
    // Initialize pending options in confirmation mode
    this.resetPendingOptions();
  }

  /**
   * Lifecycle hook called after content projection is complete
   * Processes projected content and sets up custom trigger
   */
  ngAfterContentInit() {
    // Process content projected options with a small delay to ensure all components are initialized
    // This handles cases where projected content might not be immediately available
    setTimeout(() => {
      this.processContentProjectedOptions();
    });
    
    // Subscribe to content changes for dynamic content projection
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

    // Setup custom trigger if provided via content projection
    this.setupCustomTrigger();
  }

  /**
   * Lifecycle hook called when input properties change
   * Handles configuration updates and content projection changes
   * @param changes - Object containing information about what changed
   */
  ngOnChanges(changes: SimpleChanges) {
    // Check if any configuration-related properties changed
    const configProperties = ['config', 'options', 'placeholder', 'disabled', 'required', 
      'multiple', 'confirmation', 'panelClass', 'searchable', 'searchPlaceholder', 
      'minSearchLength', 'iconType', 'infieldLabel', 'infieldLabelText', 'infieldLabelPosition', 
      'floatlabel', 'floatlabelText', 'floatlabelPosition', 'strictConfigMode'];
    
    const hasConfigChanges = configProperties.some(prop => changes[prop]);
    
    if (hasConfigChanges) {
      this.updateConfiguration();
      this.updateInternalState();
    }
    
    // Process content projected options if they change
    if (changes['optionComponents'] || changes['optionGroupComponents']) {
      this.processContentProjectedOptions();
    }
  }

  /**
   * Processes content projected options and groups them into the options array
   * This allows users to define options using HTML instead of JavaScript arrays
   */
  private processContentProjectedOptions(): void {
    // If content projected options are available, use them instead of the options input
    const hasDirectOptions = this.optionComponents && this.optionComponents.length > 0;
    const hasGroupedOptions = this.optionGroupComponents && this.optionGroupComponents.length > 0;
    
    if (hasDirectOptions || hasGroupedOptions) {
      const projectedOptions: NxtDropdownOption[] = [];
      
      // Process direct options (nxt-option components)
      if (hasDirectOptions) {
        this.optionComponents!.forEach(optionComp => {
          projectedOptions.push({
            value: optionComp.value,
            label: optionComp.option.label,
            disabled: optionComp.disabled
          });
        });
      }
      
      // Process grouped options (nxt-option-group components)
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
      this.checkAndHandlePendingValue();
    }
  }

  /**
   * Sets up event handling for custom trigger component
   * Subscribes to trigger events and updates trigger properties
   */
  private setupCustomTrigger(): void {
    if (!this.customTrigger) return;
    
    // Subscribe to trigger click events
    this.customTrigger.triggerClick.subscribe((event: Event) => {
      this.toggleDropdown();
    });

    // Subscribe to trigger keyboard events
    this.customTrigger.keyDown.subscribe((event: KeyboardEvent) => {
      this.onKeyDown(event);
    });

    // Update trigger properties to reflect current state
    this.updateTriggerProperties();
  }

  /**
   * Updates the custom trigger component with current state properties
   * Ensures the trigger reflects the current disabled, open, and other states
   */
  private updateTriggerProperties(): void {
    if (!this.customTrigger) return;
    
    this.customTrigger.disabled = this.isDisabled;
    this.customTrigger.isOpen = this.isOpen;
    this.customTrigger.required = this.required;
    this.customTrigger.multiple = this.multiple;
    this.customTrigger.placeholder = this.placeholder;
    this.customTrigger.iconType = this.iconType;
  }

  /**
   * Updates the component configuration by merging config object with direct inputs
   * Handles validation and applies the merged configuration
   */
  private updateConfiguration(): void {
    // Collect all direct input values into an object for validation and merging
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
      cancelButtonIcon: this.cancelButtonIcon,
      infieldLabel: this.infieldLabel,
      infieldLabelText: this.infieldLabelText,
      infieldLabelPosition: this.infieldLabelPosition,
      floatlabel: this.floatlabel,
      floatlabelText: this.floatlabelText,
      floatlabelPosition: this.floatlabelPosition
    };

    // Validate configuration to ensure no conflicts between config object and direct inputs
    const validation = validateStrictConfiguration(this.config, directInputs, this.strictConfigMode);
    if (!validation.isValid) {
      console.error('[NXT Dropdown] Configuration Error:', validation.errorMessage);
      return;
    }

    // Merge configuration object with direct inputs
    const mergedConfig = mergeConfiguration(this.config, directInputs, this.strictConfigMode);
    
    // Apply merged configuration directly to input properties
    Object.assign(this, mergedConfig);
    
    // Handle confirmation buttons with fallback to config or defaults
    this.applyButtonText = this.config.confirmationButtons?.apply?.text || this.applyButtonText || 'Apply';
    this.applyButtonIcon = this.config.confirmationButtons?.apply?.icon || this.applyButtonIcon || '';
    this.cancelButtonText = this.config.confirmationButtons?.cancel?.text || this.cancelButtonText || 'Cancel';
    this.cancelButtonIcon = this.config.confirmationButtons?.cancel?.icon || this.cancelButtonIcon || '';

    // Check if options became available and we have a pending value
    this.checkAndHandlePendingValue();
  }

  /**
   * Handles a pending value that was stored before options were available
   * Applies the pending value now that options are loaded
   */
  private handlePendingValue(): void {
    // Apply the pending value now that options are available
    this.setValue(this.pendingValue);
    this.updateSelectedOptions();
    
    // Reset pending options in confirmation mode
    this.resetPendingOptions();
    
    // Clear the pending value since we've processed it
    this.setPendingValue(null);
  }

  /**
   * Getter to check if a custom trigger is being used
   * @returns true if a custom trigger component is projected
   */
  get hasCustomTrigger(): boolean {
    return !!this.customTrigger;
  }

  /**
   * Host listener for document clicks to close dropdown when clicking outside
   * @param event - The click event
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  // ==================== CONTROL VALUE ACCESSOR METHODS ====================
  
  /**
   * ControlValueAccessor method called by Angular forms to set the value
   * Handles both single values and arrays for multiple selection
   * @param value - The value to set (can be single value or array)
   */
  writeValue(value: any): void {
    this.setValue(value);
    
    // If options are not available yet, store the value as pending
    // This handles the case where the form control value is set before the dropdown options are loaded
    if (!this.options || this.options.length === 0) {
      this.setPendingValue(value);
      return;
    }
    
    // Clear pending value since we can now process it
    this.setPendingValue(null);
    
    this.updateSelectedOptions();
    
    // Reset pending options in confirmation mode
    this.resetPendingOptions();
  }

  /**
   * ControlValueAccessor method to register the onChange callback
   * @param fn - The callback function to call when value changes
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * ControlValueAccessor method to register the onTouched callback
   * @param fn - The callback function to call when the control is touched
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * ControlValueAccessor method to set the disabled state
   * @param isDisabled - Whether the control should be disabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.setIsDisabled(isDisabled);
    this.updateTriggerProperties();
  }

  // ==================== DROPDOWN INTERACTION METHODS ====================
  
  /**
   * Toggles the dropdown open/closed state
   * Handles search input focus and position calculation
   */
  toggleDropdown(): void {
    if (!this.isDisabled) {
      this.setIsOpen(!this.isOpen);
      this.updateTriggerProperties();
      
      if (this.isOpen) {
        // Calculate position when opening
        this.calculateDropdownPosition();
        this.onTouched();
        
        // Initialize pending options in confirmation mode
        this.resetPendingOptions();
        
        // Show and focus search input if searchable
        if (this.searchable) {
          this.setShowSearchInput(true);
          // Focus search input after a short delay to ensure it's rendered
          setTimeout(() => {
            const searchInput = this.elementRef.nativeElement.querySelector('.nxt-dropdown-search-input');
            if (searchInput) {
              searchInput.focus();
            }
          }, 100);
        }
      } else {
        // Clear search when closing
        this.clearSearch();
      }
    }
  }

  /**
   * Calculates whether the dropdown should be positioned above or below the trigger
   * Based on available viewport space and dropdown content height
   */
  private calculateDropdownPosition(): void {
    const triggerElement = this.elementRef.nativeElement.querySelector('.nxt-dropdown-trigger');
    if (!triggerElement) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownMaxHeight = this.confirmation ? 300 : 200; // Adjust based on confirmation mode
    const buffer = 50; // Additional buffer space as requested
    
    // Calculate available space below the trigger
    const spaceBelow = viewportHeight - triggerRect.bottom;
    
    // If there's not enough space below (max-height + buffer), position above
    this.setShouldPositionAbove(spaceBelow < (dropdownMaxHeight + buffer));
  }

  /**
   * Host listener for window resize events
   * Recalculates dropdown position when window is resized
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.isOpen) {
      this.calculateDropdownPosition();
    }
  }

  /**
   * Host listener for window scroll events
   * Recalculates dropdown position when page is scrolled
   */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.isOpen) {
      this.calculateDropdownPosition();
    }
  }

  /**
   * Closes the dropdown and clears search state
   */
  closeDropdown(): void {
    this.setIsOpen(false);
    this.updateTriggerProperties();
    this.clearSearch();
    
    // Reset pending options in confirmation mode
    this.resetPendingOptions();
  }

  // ==================== SEARCH FUNCTIONALITY METHODS ====================
  
  /**
   * Handles search input changes
   * Updates search text and filters options accordingly
   * @param event - The input event from the search field
   */
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.setSearchText(target.value);
    this.updateFilteredOptions();
  }

  /**
   * Handles keyboard events in the search input
   * Supports Enter to select first option and Escape to close dropdown
   * @param event - The keyboard event
   */
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

  /**
   * Clears the search state and resets filtered options
   */
  clearSearch(): void {
    const clearedState = clearSearchState();
    this.setSearchText(clearedState.searchText);
    this.setShowSearchInput(clearedState.showSearchInput);
    this.updateFilteredOptions();
  }

  /**
   * Updates the filtered options based on current search text
   * Also recalculates dropdown position if open
   */
  updateFilteredOptions(): void {
    this.setFilteredOptions(filterOptionsBySearch(this.options, this.searchText, this.searchable, this.minSearchLength));
    
    // Recalculate position if dropdown is open, as content height might have changed
    if (this.isOpen) {
      setTimeout(() => this.calculateDropdownPosition(), 0);
    }
  }

  // ==================== OPTION SELECTION METHODS ====================
  
  /**
   * Handles option selection based on current mode (single/multiple, confirmation)
   * @param option - The option to select
   */
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

  /**
   * Handles "Select All" functionality for multiple selection
   * Works differently in confirmation mode vs normal mode
   */
  selectAll(): void {
    if (!this.multiple) return;

    if (this.confirmation) {
      this.togglePendingSelectAll();
    } else {
      this.toggleSelectAll();
    }
  }

  /**
   * Toggles select all functionality in normal mode (no confirmation)
   * Selects all available options or deselects all if all are selected
   */
  private toggleSelectAll(): void {
    const availableOptions = this.filteredOptions.filter(option => !option.disabled);
    const allSelected = availableOptions.every(option => 
      this.selectedOptions.some(selected => selected.value === option.value)
    );

    if (allSelected) {
      // Deselect all
      this.setSelectedOptions([]);
      this.setValue([]);
    } else {
      // Select all available options
      this.setSelectedOptions([...availableOptions]);
      this.setValue(availableOptions.map(opt => opt.value));
    }

    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
  }

  /**
   * Toggles select all functionality in confirmation mode
   * Only affects pending options, not the actual selection
   */
  private togglePendingSelectAll(): void {
    const availableOptions = this.filteredOptions.filter(option => !option.disabled);
    const allSelected = availableOptions.every(option => 
      this.pendingOptions.some(selected => selected.value === option.value)
    );

    if (allSelected) {
      // Deselect all
      this.setPendingOptions([]);
    } else {
      // Select all available options
      this.setPendingOptions([...availableOptions]);
    }
  }

  /**
   * Toggles an option in the pending selection (confirmation mode)
   * @param option - The option to toggle
   */
  private togglePendingSelection(option: NxtDropdownOption): void {
    const index = this.pendingOptions.findIndex(opt => opt.value === option.value);
    
    if (index > -1) {
      this.pendingOptions.splice(index, 1);
    } else {
      this.pendingOptions.push(option);
    }
  }

  /**
   * Checks if all visible options are selected
   * @returns true if all filtered options are selected
   */
  isAllSelected(): boolean {
    return isAllSelected(this.filteredOptions, this.confirmation ? this.pendingOptions : this.selectedOptions, this.multiple);
  }

  /**
   * Checks if some (but not all) visible options are selected
   * @returns true if some filtered options are selected but not all
   */
  isPartiallySelected(): boolean {
    return isPartiallySelected(this.filteredOptions, this.confirmation ? this.pendingOptions : this.selectedOptions, this.multiple);
  }

  /**
   * Checks if a specific option is selected
   * @param option - The option to check
   * @returns true if the option is selected
   */
  isOptionSelected(option: NxtDropdownOption): boolean {
    const optionsToCheck = this.confirmation && this.multiple ? this.pendingOptions : this.selectedOptions;
    return isOptionSelected(option, optionsToCheck);
  }

  /**
   * Selects a single option (single selection mode)
   * Immediately applies the selection and closes the dropdown
   * @param option - The option to select
   */
  private selectSingleOption(option: NxtDropdownOption): void {
    this.setValue(option.value);
    this.setSelectedOptions([option]);
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
    this.closeDropdown();
  }

  /**
   * Toggles an option in multiple selection mode (no confirmation)
   * @param option - The option to toggle
   */
  private toggleMultipleSelection(option: NxtDropdownOption): void {
    this.setSelectedOptions(toggleOptionSelection(option, this.selectedOptions));
    this.setValue(getValuesFromSelectedOptions(this.selectedOptions, this.multiple));
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
  }

  /**
   * Updates the selectedOptions array based on the current value
   * Maps value(s) back to full option objects
   */
  private updateSelectedOptions(): void {
    this.setSelectedOptions(updateSelectedOptions(this.value, this.options, this.multiple));
  }

  // ==================== DISPLAY METHODS ====================
  
  /**
   * Gets the display text for the current selection
   * @returns Formatted string showing selected options or placeholder
   */
  getDisplayText(): string {
    return getDisplayText(this.selectedOptions, this.placeholder, this.multiple);
  }

  /**
   * Gets the display text for pending selections in confirmation mode
   * @returns Formatted string showing pending options or placeholder
   */
  getPendingDisplayText(): string {
    return getPendingDisplayText(this.pendingOptions, this.placeholder, this.multiple);
  }

  /**
   * Gets the text to display for the infield label
   * Uses infieldLabelText if provided, otherwise falls back to placeholder
   * @returns The label text for infield label mode
   */
  getInfieldLabelText(): string {
    return this.infieldLabelText || this.placeholder;
  }

  /**
   * Gets the text to display for the floating label
   * Uses floatlabelText if provided, otherwise falls back to placeholder
   * @returns The label text for floating label mode
   */
  getFloatLabelText(): string {
    return this.floatlabelText || this.placeholder;
  }

  // ==================== KEYBOARD NAVIGATION ====================
  
  /**
   * Handles keyboard events for the dropdown trigger
   * Supports Enter, Space, Escape, and arrow keys
   * @param event - The keyboard event
   */
  onKeyDown(event: KeyboardEvent): void {
    handleDropdownKeyDown(event, this.isDisabled, this.isOpen, {
      toggleDropdown: () => this.toggleDropdown(),
      closeDropdown: () => this.closeDropdown()
    });
  }

  // ==================== UTILITY METHODS ====================
  
  /**
   * TrackBy function for ngFor optimization
   * @param index - The index of the item
   * @param option - The option object
   * @returns The value to track (option value)
   */
  trackByValue(index: number, option: NxtDropdownOption): any {
    return trackByValue(index, option);
  }

  /**
   * Determines if a group header should be shown for an option
   * Shows header only for the first option in each group
   * @param option - The current option
   * @param index - The index of the current option
   * @returns true if a group header should be shown
   */
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

  // ==================== CONFIRMATION MODE METHODS ====================
  
  /**
   * Applies pending selections in confirmation mode
   * Updates the actual selection and closes the dropdown
   */
  applySelection(): void {
    if (!this.confirmation || !this.multiple) return;

    this.setSelectedOptions([...this.pendingOptions]);
    this.setValue(getValuesFromSelectedOptions(this.selectedOptions, this.multiple));
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
    this.closeDropdown();
  }

  /**
   * Cancels pending selections in confirmation mode
   * Resets pending options to match current selection and closes dropdown
   */
  cancelSelection(): void {
    if (!this.confirmation || !this.multiple) return;

    // Reset pending options to match current selected options
    this.resetPendingOptions();
    this.closeDropdown();
  }

  /**
   * Sanitizes and returns the icon HTML for safe rendering
   * Supports both string icons (emoji, unicode) and HTML elements (font icons)
   * @param icon - The icon string to sanitize
   * @returns SafeHtml object that can be rendered in the template
   */
  getSanitizedIcon(icon: string): SafeHtml {
    return getSanitizedIcon(icon, this.sanitizer);
  }
} 
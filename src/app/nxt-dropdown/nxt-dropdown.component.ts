import { Component, forwardRef, Input, Output, EventEmitter, OnInit, HostListener, ElementRef, OnChanges, SimpleChanges, ContentChildren, QueryList, AfterContentInit, ContentChild, ViewChild } from '@angular/core';
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
  
  @Input() options: NxtDropdownOption[] = [];

  @Input() config: NxtDropdownConfig = {};

  _config: NxtDropdownConfig = {
    placeholder: 'Select an option',
    disabled: false,
    required: false,
    multiple: false,
    confirmation: false,
    panelClass: '',
    searchable: false,
    searchPlaceholder: 'Search options...',
    minSearchLength: 0,
    iconType: 'caret',
    infieldLabel: false,
    infieldLabelText: '',
    infieldLabelPosition: 'infield',
    floatlabel: false,
    floatlabelText: '',
    floatlabelPosition: 'infield',
    confirmationButtons: {
      apply: {
        text: 'Apply',
        icon: ''
      },
      cancel: {
        text: 'Cancel',
        icon: ''
      }
    },
    selectAllPosition: 'below'
  }
  
  @Output() selectionChange = new EventEmitter<any>();

  @ContentChildren(NxtOptionComponent) optionComponents?: QueryList<NxtOptionComponent>;
  
  @ContentChildren(NxtOptionGroupComponent) optionGroupComponents?: QueryList<NxtOptionGroupComponent>;
  
  @ContentChild(NxtDropdownTriggerComponent) customTrigger?: NxtDropdownTriggerComponent;

  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef<HTMLInputElement>;
  
  @ViewChild('dropdownTrigger', { static: false }) dropdownTrigger!: ElementRef<HTMLElement>;
  
  @ViewChild('dropdownPanel', { static: false }) dropdownPanel!: ElementRef<HTMLElement>;

  value: any;
  
  isDisabled: boolean = false;
  
  isOpen: boolean = false;
  
  selectedOptions: NxtDropdownOption[] = [];
  
  pendingOptions: NxtDropdownOption[] = [];
  
  private pendingValue: any = null;
  
  searchText: string = '';
  
  filteredOptions: NxtDropdownOption[] = [];
  
  showSearchInput: boolean = false;
  
  shouldPositionAbove: boolean = false;

  private onChange = (value: any) => {};
  
  private onTouched = () => {};

  constructor(
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer
  ) {}

  private resetPendingOptions(): void {
    if (this._config.confirmation && this._config.multiple) {
      this.pendingOptions = [...this.selectedOptions];
    }
  }

  private updateInternalState(): void {
    this.isDisabled = this._config.disabled;
    this.updateSelectedOptions();
    this.updateFilteredOptions();
  }

  private checkAndHandlePendingValue(): void {
    if (this.options && this.options.length > 0 && this.pendingValue !== null) {
      this.handlePendingValue();
    }
  }

  ngOnInit() {
    this.updateConfiguration();
    
    this.updateInternalState();
    
    this.resetPendingOptions();
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.processContentProjectedOptions();
    });
    
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

    this.setupCustomTrigger();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this._config = { ...this._config, ...changes['config'].currentValue };
    }
    
    const configProperties = ['config', 'options', 'placeholder', 'disabled', 'required', 
      'multiple', 'confirmation', 'panelClass', 'searchable', 'searchPlaceholder', 
      'minSearchLength', 'iconType', 'infieldLabel', 'infieldLabelText', 'infieldLabelPosition', 
      'floatlabel', 'floatlabelText', 'floatlabelPosition', 'strictConfigMode'];
    
    const hasConfigChanges = configProperties.some(prop => changes[prop]);
    
    if (hasConfigChanges) {
      this.updateConfiguration();
      this.updateInternalState();
    }
    
    if (changes['optionComponents'] || changes['optionGroupComponents']) {
      this.processContentProjectedOptions();
    }
  }

  private processContentProjectedOptions(): void {
    const hasDirectOptions = this.optionComponents && this.optionComponents.length > 0;
    const hasGroupedOptions = this.optionGroupComponents && this.optionGroupComponents.length > 0;
    
    if (hasDirectOptions || hasGroupedOptions) {
      const projectedOptions: NxtDropdownOption[] = [];
      
      if (hasDirectOptions) {
        this.optionComponents!.forEach(optionComp => {
          projectedOptions.push({
            value: optionComp.value,
            label: optionComp.option.label,
            disabled: optionComp.disabled
          });
        });
      }
      
      if (hasGroupedOptions) {
        this.optionGroupComponents!.forEach(groupComp => {
          const groupOptions = groupComp.getOptions();
          projectedOptions.push(...groupOptions);
        });
      }
      
      this.options = projectedOptions;
      this.updateFilteredOptions();
      
      this.checkAndHandlePendingValue();
    }
  }

  private setupCustomTrigger(): void {
    if (!this.customTrigger) return;
    
    this.customTrigger.triggerClick.subscribe((event: Event) => {
      this.toggleDropdown();
    });

    this.customTrigger.keyDown.subscribe((event: KeyboardEvent) => {
      this.onKeyDown(event);
    });

    this.updateTriggerProperties();
  }

  private updateTriggerProperties(): void {
    if (!this.customTrigger) return;
    
    this.customTrigger.disabled = this.isDisabled;
    this.customTrigger.isOpen = this.isOpen;
    this.customTrigger.required = this._config.required;
    this.customTrigger.multiple = this._config.multiple;
    this.customTrigger.placeholder = this._config.placeholder;
    this.customTrigger.iconType = this._config.iconType;
  }

  private updateConfiguration(): void {
    

    this.checkAndHandlePendingValue();
  }

  private handlePendingValue(): void {
    this.value = this.pendingValue;
    this.updateSelectedOptions();
    
    this.resetPendingOptions();
    
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

  private getTriggerElement(): HTMLElement | null {
    if (this.hasCustomTrigger) {
      const customTriggerElement = this.elementRef.nativeElement.querySelector('nxt-dropdown-trigger');
      return customTriggerElement as HTMLElement;
    }
    
    return this.dropdownTrigger?.nativeElement || null;
  }

  private focusSearchInput(): void {
    if (this.searchInput?.nativeElement) {
      this.searchInput.nativeElement.focus();
    }
  }

  private updateDropdownPosition(): void {
    if (this.isOpen && this.dropdownPanel?.nativeElement) {
      this.calculateDropdownPosition();
      
      this.ensurePanelInViewport();
    }
  }

  private ensurePanelInViewport(): void {
    if (!this.dropdownPanel?.nativeElement) return;

    const panel = this.dropdownPanel.nativeElement;
    const panelRect = panel.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    panel.style.transform = '';
    
    if (panelRect.right > viewportWidth) {
      const overflowX = panelRect.right - viewportWidth;
      panel.style.transform = `translateX(-${overflowX + 10}px)`;
    } else if (panelRect.left < 0) {
      const overflowX = Math.abs(panelRect.left);
      panel.style.transform = `translateX(${overflowX + 10}px)`;
    }
    
    if (this.shouldPositionAbove && panelRect.top < 0) {
      const overflowY = Math.abs(panelRect.top);
      const currentTransform = panel.style.transform;
      panel.style.transform = `${currentTransform} translateY(${overflowY + 10}px)`;
    }
  }

  clearSearchInput(): void {
    if (this.searchInput?.nativeElement) {
      this.searchInput.nativeElement.value = '';
      this.searchInput.nativeElement.focus();
    }
  }

  getSearchInputValue(): string {
    return this.searchInput?.nativeElement?.value || '';
  }

  setSearchInputValue(value: string): void {
    if (this.searchInput?.nativeElement) {
      this.searchInput.nativeElement.value = value;
    }
  }

  writeValue(value: any): void {
    this.value = value;
    
    if (!this.options || this.options.length === 0) {
      this.pendingValue = value;
      return;
    }
    
    this.pendingValue = null;
    
    this.updateSelectedOptions();
    
    this.resetPendingOptions();
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
        
        this.resetPendingOptions();
        
        if (this._config.searchable) {
          this.showSearchInput = true;
          setTimeout(() => {
            this.focusSearchInput();
          }, 100);
        }
      } else {
        this.clearSearch();
      }
    }
  }

  private calculateDropdownPosition(): void {
    const triggerElement = this.getTriggerElement();
    if (!triggerElement) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownMaxHeight = this._config.confirmation ? 300 : 200;
    const buffer = 50;
    
    const spaceBelow = viewportHeight - triggerRect.bottom;
    
    this.shouldPositionAbove = spaceBelow < (dropdownMaxHeight + buffer);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.isOpen) {
      this.calculateDropdownPosition();
      this.updateDropdownPosition();
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.isOpen) {
      this.calculateDropdownPosition();
      this.updateDropdownPosition();
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.updateTriggerProperties();
    this.clearSearch();
    
    this.resetPendingOptions();
  }

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
    this.clearSearchInput();
  }

  updateFilteredOptions(): void {
    this.filteredOptions = filterOptionsBySearch(this.options, this.searchText, this._config.searchable, this._config.minSearchLength);
    
    if (this.isOpen) {
      setTimeout(() => this.calculateDropdownPosition(), 0);
    }
  }

  selectOption(option: NxtDropdownOption): void {
    if (option.disabled) return;

    if (this._config.multiple) {
      if (this._config.confirmation) {
        this.togglePendingSelection(option);
      } else {
        this.toggleMultipleSelection(option);
      }
    } else {
      this.selectSingleOption(option);
    }
  }

  selectAll(): void {
    if (!this._config.multiple) return;

    if (this._config.confirmation) {
      this.togglePendingSelectAll();
    } else {
      this.toggleSelectAll();
    }
  }

  private toggleSelectAll(): void {
    const availableOptions = this.options.filter(option => !option.disabled);
    const allSelected = availableOptions.every(option => 
      this.selectedOptions.some(selected => selected.value === option.value)
    );

    if (allSelected) {
      this.selectedOptions = [];
      this.value = [];
    } else {
      this.selectedOptions = [...availableOptions];
      this.value = availableOptions.map(opt => opt.value);
    }

    this.updateFilteredOptions();

    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
  }

  private togglePendingSelectAll(): void {
    const availableOptions = this.options.filter(option => !option.disabled);
    const allSelected = availableOptions.every(option => 
      this.pendingOptions.some(selected => selected.value === option.value)
    );

    if (allSelected) {
      this.pendingOptions = [];
    } else {
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
    return isAllSelected(this.filteredOptions, this._config.confirmation ? this.pendingOptions : this.selectedOptions, this._config.multiple);
  }

  isPartiallySelected(): boolean {
    return isPartiallySelected(this.filteredOptions, this._config.confirmation ? this.pendingOptions : this.selectedOptions, this._config.multiple);
  }

  isAllAvailableSelected(): boolean {
    const availableOptions = this.options.filter(option => !option.disabled);
    return availableOptions.every(option => 
      (this._config.confirmation ? this.pendingOptions : this.selectedOptions).some(selected => selected.value === option.value)
    );
  }

  isPartiallyAvailableSelected(): boolean {
    const availableOptions = this.options.filter(option => !option.disabled);
    const selectedOptions = this._config.confirmation ? this.pendingOptions : this.selectedOptions;
    const selectedCount = availableOptions.filter(option => 
      selectedOptions.some(selected => selected.value === option.value)
    ).length;
    return selectedCount > 0 && selectedCount < availableOptions.length;
  }

  isOptionSelected(option: NxtDropdownOption): boolean {
    const optionsToCheck = this._config.confirmation && this._config.multiple ? this.pendingOptions : this.selectedOptions;
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
    this.value = getValuesFromSelectedOptions(this.selectedOptions, this._config.multiple);
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
  }

  private updateSelectedOptions(): void {
    this.selectedOptions = updateSelectedOptions(this.value, this.options, this._config.multiple);
  }

  getDisplayText(): string {
    return getDisplayText(this.selectedOptions, this._config.placeholder, this._config.multiple);
  }

  getPendingDisplayText(): string {
    return getPendingDisplayText(this.pendingOptions, this._config.placeholder, this._config.multiple);
  }

  getInfieldLabelText(): string {
    return this._config.infieldLabelText || this._config.placeholder;
  }

  getFloatLabelText(): string {
    return this._config.floatlabelText || this._config.placeholder;
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
    
    for (let i = 0; i < index; i++) {
      if (this.filteredOptions[i].group === option.group) {
        return false;
      }
    }
    
    return true;
  }

  applySelection(): void {
    if (!this._config.confirmation || !this._config.multiple) return;

    this.selectedOptions = [...this.pendingOptions];
    this.value = getValuesFromSelectedOptions(this.selectedOptions, this._config.multiple);
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
    this.closeDropdown();
  }

  cancelSelection(): void {
    if (!this._config.confirmation || !this._config.multiple) return;

    this.resetPendingOptions();
    this.closeDropdown();
  }

  getSanitizedIcon(icon: string): SafeHtml {
    return getSanitizedIcon(icon, this.sanitizer);
  }
} 
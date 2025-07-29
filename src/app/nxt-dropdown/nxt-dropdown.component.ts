import { Component, forwardRef, Input, Output, EventEmitter, OnInit, HostListener, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

  export interface NxtDropdownOption {
  value: any;
  label: string;
  disabled?: boolean;
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
export class NxtDropdownComponent implements ControlValueAccessor, OnInit {
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
  @Output() selectionChange = new EventEmitter<any>();

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
    this.isDisabled = this.disabled;
    this.updateSelectedOptions();
    this.updateFilteredOptions();
    if (this.confirmation && this.multiple) {
      this.pendingOptions = [...this.selectedOptions];
    }
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
  }

  toggleDropdown(): void {
    if (!this.isDisabled) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.onTouched();
        if (this.searchable) {
          this.showSearchInput = true;
          // Focus search input after a short delay to ensure it's rendered
          setTimeout(() => {
            const searchInput = this.elementRef.nativeElement.querySelector('.ntx-select-search-input');
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
    if (!this.searchable || !this.searchText || this.searchText.length < this.minSearchLength) {
      this.filteredOptions = [...this.options];
    } else {
      const searchLower = this.searchText.toLowerCase();
      this.filteredOptions = this.options.filter(option => 
        option.label.toLowerCase().includes(searchLower)
      );
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
    if (!this.multiple) return false;
    
    const availableOptions = this.filteredOptions.filter(option => !option.disabled);
    const optionsToCheck = this.confirmation ? this.pendingOptions : this.selectedOptions;
    
    return availableOptions.length > 0 && 
           availableOptions.every(option => 
             optionsToCheck.some(selected => selected.value === option.value)
           );
  }

  isPartiallySelected(): boolean {
    if (!this.multiple) return false;
    
    const availableOptions = this.filteredOptions.filter(option => !option.disabled);
    const optionsToCheck = this.confirmation ? this.pendingOptions : this.selectedOptions;
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
  }

  private updateSelectedOptions(): void {
    if (!this.value) {
      this.selectedOptions = [];
      return;
    }

    if (this.multiple && Array.isArray(this.value)) {
      this.selectedOptions = this.options.filter(option => 
        this.value.includes(option.value)
      );
    } else {
      this.selectedOptions = this.options.filter(option => 
        option.value === this.value
      );
    }
  }

  getDisplayText(): string {
    if (this.selectedOptions.length === 0) {
      return this.placeholder;
    }

    if (this.multiple) {
      if (this.selectedOptions.length === 1) {
        return this.selectedOptions[0].label;
      }
      return `${this.selectedOptions.length} items selected`;
    }

    return this.selectedOptions[0].label;
  }

  getPendingDisplayText(): string {
    if (this.pendingOptions.length === 0) {
      return this.placeholder;
    }

    if (this.multiple) {
      if (this.pendingOptions.length === 1) {
        return this.pendingOptions[0].label;
      }
      return `${this.pendingOptions.length} items selected`;
    }

    return this.pendingOptions[0].label;
  }

  isOptionSelected(option: NxtDropdownOption): boolean {
    if (this.confirmation && this.multiple) {
      return this.pendingOptions.some(selected => selected.value === option.value);
    }
    return this.selectedOptions.some(selected => selected.value === option.value);
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
    if (!this.confirmation || !this.multiple) return;

    this.selectedOptions = [...this.pendingOptions];
    this.value = this.selectedOptions.map(opt => opt.value);
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
} 
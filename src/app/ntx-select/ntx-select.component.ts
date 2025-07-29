import { Component, forwardRef, Input, Output, EventEmitter, OnInit, HostListener, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface NtxSelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'ntx-select',
  templateUrl: './ntx-select.component.html',
  styleUrls: ['./ntx-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NtxSelectComponent),
      multi: true
    }
  ]
})
export class NtxSelectComponent implements ControlValueAccessor, OnInit {
  @Input() options: NtxSelectOption[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() multiple: boolean = false;
  @Input() panelClass: string = '';
  @Output() selectionChange = new EventEmitter<any>();

  value: any;
  isDisabled: boolean = false;
  isOpen: boolean = false;
  selectedOptions: NtxSelectOption[] = [];

  // ControlValueAccessor implementation
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.isDisabled = this.disabled;
    this.updateSelectedOptions();
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
      }
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  selectOption(option: NtxSelectOption): void {
    if (option.disabled) return;

    if (this.multiple) {
      this.toggleMultipleSelection(option);
    } else {
      this.selectSingleOption(option);
    }
  }

  selectAll(): void {
    if (!this.multiple) return;

    const availableOptions = this.options.filter(option => !option.disabled);
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

  isAllSelected(): boolean {
    if (!this.multiple) return false;
    
    const availableOptions = this.options.filter(option => !option.disabled);
    return availableOptions.length > 0 && 
           availableOptions.every(option => 
             this.selectedOptions.some(selected => selected.value === option.value)
           );
  }

  isPartiallySelected(): boolean {
    if (!this.multiple) return false;
    
    const availableOptions = this.options.filter(option => !option.disabled);
    const selectedCount = availableOptions.filter(option => 
      this.selectedOptions.some(selected => selected.value === option.value)
    ).length;
    
    return selectedCount > 0 && selectedCount < availableOptions.length;
  }

  private selectSingleOption(option: NtxSelectOption): void {
    this.value = option.value;
    this.selectedOptions = [option];
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(this.value);
    this.closeDropdown();
  }

  private toggleMultipleSelection(option: NtxSelectOption): void {
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

  isOptionSelected(option: NtxSelectOption): boolean {
    return this.selectedOptions.some(selected => selected.value === option.value);
  }

  removeOption(event: Event, option: NtxSelectOption): void {
    event.stopPropagation();
    this.selectOption(option);
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

  trackByValue(index: number, option: NtxSelectOption): any {
    return option.value;
  }
} 
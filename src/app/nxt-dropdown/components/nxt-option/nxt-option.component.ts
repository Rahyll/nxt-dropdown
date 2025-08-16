/**
 * Option Component
 * 
 * This component represents a single option in the dropdown.
 * It can be used via content projection to define custom option content.
 * The component extracts the display text from its projected content.
 */
import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';

/**
 * Interface defining the structure of an option value
 * Used for consistent option data structure across the dropdown
 */
export interface NxtOptionValue {
  /** The actual value of the option (can be any type) */
  value: any;
  /** The display text/label for the option */
  label: string;
  /** Whether the option is disabled and cannot be selected */
  disabled?: boolean;
  /** Optional group identifier for grouping options */
  group?: string;
  /** Optional icon to display with the option */
  icon?: string;
  /** Optional description text for the option */
  description?: string;
}

@Component({
  selector: 'nxt-option',
  template: `
    <!-- Content projection slot for custom option content -->
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NxtOptionComponent {
  
  // ==================== INPUT PROPERTIES ====================
  
  /**
   * The value of this option
   * This is what gets returned when the option is selected
   * Can be any type (string, number, object, etc.)
   */
  @Input() value: any;
  
  /**
   * Whether this option is disabled and cannot be selected
   * Default: false
   */
  @Input() disabled: boolean = false;
  
  /**
   * Optional group identifier for this option
   * Used for grouping options in the dropdown
   * Default: undefined
   */
  @Input() group?: string;
  
  // ==================== OUTPUT EVENTS ====================
  
  /**
   * Event emitted when this option is clicked
   * Emits the full option data including value, label, and other properties
   */
  @Output() optionClick = new EventEmitter<NxtOptionValue>();
  
  // ==================== GETTERS ====================
  
  /**
   * Getter that returns the complete option data
   * Combines input properties with dynamically extracted display text
   * @returns NxtOptionValue object with all option data
   */
  get option(): NxtOptionValue {
    return {
      value: this.value,
      label: this.getDisplayText(),
      disabled: this.disabled,
      group: this.group
    };
  }
  
  // ==================== PRIVATE METHODS ====================
  
  /**
   * Extracts the display text from the projected content
   * Gets the text content of the component's DOM element
   * @returns The trimmed text content or empty string if none
   */
  private getDisplayText(): string {
    // Get the text content from the projected content
    const element = this.elementRef.nativeElement;
    return element.textContent?.trim() || '';
  }
  
  // ==================== CONSTRUCTOR ====================
  
  /**
   * Constructor - initializes dependencies
   * @param elementRef - Reference to the component's DOM element for text extraction
   */
  constructor(private elementRef: ElementRef) {}
  
  // ==================== PUBLIC METHODS ====================
  
  /**
   * Handles click events on this option
   * Only emits the optionClick event if the option is not disabled
   * Emits the complete option data for parent component handling
   */
  onClick(): void {
    if (!this.disabled) {
      this.optionClick.emit(this.option);
    }
  }
} 
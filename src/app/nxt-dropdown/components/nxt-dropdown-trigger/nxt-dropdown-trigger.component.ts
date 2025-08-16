/**
 * Dropdown Trigger Component
 * 
 * This component provides a customizable trigger element for the dropdown.
 * It can be used as the default trigger or as a custom trigger via content projection.
 * Supports various icon types and accessibility features.
 */
import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'nxt-dropdown-trigger',
  template: `
    <!-- Main trigger container with dynamic CSS classes and accessibility attributes -->
    <div class="nxt-dropdown-trigger-content"
         [class.disabled]="disabled"
         [class.open]="isOpen"
         [class.required]="required"
         [class.multiple]="multiple"
         (click)="onTriggerClick($event)"
         (keydown)="onKeyDown($event)"
         tabindex="0"
         role="combobox"
         [attr.aria-expanded]="isOpen"
         [attr.aria-haspopup]="true"
         [attr.aria-label]="placeholder">
      
      <!-- Content projection slot for custom trigger content -->
      <ng-content></ng-content>
      
      <!-- Arrow icon container - only shown if showArrow is true -->
      <div class="nxt-dropdown-arrow" *ngIf="showArrow">
        <!-- Down Caret Icon - curved arrow pointing down -->
        <svg *ngIf="iconType === 'caret'" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
        <!-- Down Arrow Icon - straight arrow with arrowhead -->
        <svg *ngIf="iconType === 'arrow'" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 2L6 10M6 10L3 7M6 10L9 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
        <!-- Sharp Cornered Down Caret Icon - filled triangle pointing down -->
        <svg *ngIf="iconType === 'sharp-caret'" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <polygon points="3,4.5 6,7.5 9,4.5" fill="currentColor"/>
        </svg>
        
        <!-- Inverted Triangle Icon - filled inverted triangle -->
        <svg *ngIf="iconType === 'inverted-triangle'" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <polygon points="2,3 6,9 10,3" fill="currentColor"/>
        </svg>
      </div>
    </div>
  `,
  styleUrls: ['./nxt-dropdown-trigger.component.scss']
})
export class NxtDropdownTriggerComponent {
  
  // ==================== INPUT PROPERTIES ====================
  
  /**
   * Whether the trigger is disabled and cannot be interacted with
   * Default: false
   */
  @Input() disabled: boolean = false;
  
  /**
   * Whether the dropdown is currently open
   * Used for visual state indication (arrow rotation, etc.)
   * Default: false
   */
  @Input() isOpen: boolean = false;
  
  /**
   * Whether the dropdown is required (for form validation)
   * May affect visual styling to indicate required state
   * Default: false
   */
  @Input() required: boolean = false;
  
  /**
   * Whether the dropdown supports multiple selection
   * May affect visual styling or behavior
   * Default: false
   */
  @Input() multiple: boolean = false;
  
  /**
   * Placeholder text for accessibility (aria-label)
   * Also used as fallback display text
   * Default: 'Select an option'
   */
  @Input() placeholder: string = 'Select an option';
  
  /**
   * Whether to show the arrow/dropdown icon
   * Can be hidden for custom triggers that don't need an arrow
   * Default: true
   */
  @Input() showArrow: boolean = true;
  
  /**
   * Type of icon to display
   * Options: 'caret', 'arrow', 'sharp-caret', 'inverted-triangle'
   * Default: 'caret'
   */
  @Input() iconType: 'caret' | 'arrow' | 'sharp-caret' | 'inverted-triangle' = 'caret';

  // ==================== OUTPUT EVENTS ====================
  
  /**
   * Event emitted when the trigger is clicked
   * Emits the click event object for parent component handling
   */
  @Output() triggerClick = new EventEmitter<Event>();
  
  /**
   * Event emitted when a key is pressed on the trigger
   * Emits the keyboard event for parent component handling
   */
  @Output() keyDown = new EventEmitter<KeyboardEvent>();

  // ==================== EVENT HANDLERS ====================
  
  /**
   * Handles click events on the trigger
   * Only emits the event if the trigger is not disabled
   * @param event - The click event object
   */
  onTriggerClick(event: Event): void {
    console.log('[NXT Trigger] Click event triggered, disabled:', this.disabled);
    if (!this.disabled) {
      console.log('[NXT Trigger] Emitting triggerClick event');
      this.triggerClick.emit(event);
    }
  }

  /**
   * Handles keyboard events on the trigger
   * Only emits the event if the trigger is not disabled
   * Supports keyboard navigation (Enter, Space, Escape, arrow keys)
   * @param event - The keyboard event object
   */
  onKeyDown(event: KeyboardEvent): void {
    console.log('[NXT Trigger] Keydown event triggered, disabled:', this.disabled);
    if (!this.disabled) {
      console.log('[NXT Trigger] Emitting keyDown event');
      this.keyDown.emit(event);
    }
  }
} 
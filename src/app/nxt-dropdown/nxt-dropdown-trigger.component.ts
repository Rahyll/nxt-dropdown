import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'nxt-dropdown-trigger',
  template: `
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
      
      <ng-content></ng-content>
      
      <div class="nxt-dropdown-arrow" *ngIf="showArrow">
        <!-- Down Caret Icon -->
        <svg *ngIf="iconType === 'caret'" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
        <!-- Down Arrow Icon -->
        <svg *ngIf="iconType === 'arrow'" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 2L6 10M6 10L3 7M6 10L9 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
        <!-- Sharp Cornered Down Caret Icon -->
        <svg *ngIf="iconType === 'sharp-caret'" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <polygon points="3,4.5 6,7.5 9,4.5" fill="currentColor"/>
        </svg>
      </div>
    </div>
  `,
  styleUrls: ['./nxt-dropdown-trigger.component.scss']
})
export class NxtDropdownTriggerComponent {
  @Input() disabled: boolean = false;
  @Input() isOpen: boolean = false;
  @Input() required: boolean = false;
  @Input() multiple: boolean = false;
  @Input() placeholder: string = 'Select an option';
  @Input() showArrow: boolean = true;
  @Input() iconType: 'caret' | 'arrow' | 'sharp-caret' = 'caret';

  @Output() triggerClick = new EventEmitter<Event>();
  @Output() keyDown = new EventEmitter<KeyboardEvent>();

  onTriggerClick(event: Event): void {
    console.log('[NXT Trigger] Click event triggered, disabled:', this.disabled);
    if (!this.disabled) {
      console.log('[NXT Trigger] Emitting triggerClick event');
      this.triggerClick.emit(event);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    console.log('[NXT Trigger] Keydown event triggered, disabled:', this.disabled);
    if (!this.disabled) {
      console.log('[NXT Trigger] Emitting keyDown event');
      this.keyDown.emit(event);
    }
  }
} 
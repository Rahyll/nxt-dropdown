import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';

export interface NxtOptionValue {
  value: any;
  label: string;
  disabled?: boolean;
  group?: string;
  icon?: string;
  description?: string;
}

@Component({
  selector: 'nxt-option',
  template: `
    <ng-container *ngTemplateOutlet="optionTemplate || defaultTemplate; context: { $implicit: option }">
    </ng-container>
    
    <ng-template #defaultTemplate let-option>
      <div class="nxt-option-content">
        <div class="nxt-option-label">{{ option.label }}</div>
        <div class="nxt-option-description" *ngIf="option.description">
          {{ option.description }}
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .nxt-option-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .nxt-option-label {
      font-weight: 500;
    }
    
    .nxt-option-description {
      font-size: 0.875rem;
      color: #666;
      font-weight: normal;
    }
  `]
})
export class NxtOptionComponent {
  @Input() value: any;
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() group?: string;
  @Input() icon?: string;
  @Input() description?: string;
  
  @Output() optionClick = new EventEmitter<NxtOptionValue>();
  
  @ContentChild(TemplateRef) optionTemplate?: TemplateRef<any>;
  
  get option(): NxtOptionValue {
    return {
      value: this.value,
      label: this.label,
      disabled: this.disabled,
      group: this.group,
      icon: this.icon,
      description: this.description
    };
  }
  
  onClick(): void {
    if (!this.disabled) {
      this.optionClick.emit(this.option);
    }
  }
} 
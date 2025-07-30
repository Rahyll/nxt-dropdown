import { Component, Input, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'nxt-option-group',
  template: `
    <div class="nxt-option-group">
      <div class="nxt-option-group-label" *ngIf="label">
        <ng-container *ngTemplateOutlet="labelTemplate || defaultLabelTemplate; context: { $implicit: label }">
        </ng-container>
      </div>
      <div class="nxt-option-group-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .nxt-option-group {
      border-bottom: 1px solid #e0e0e0;
    }
    
    .nxt-option-group:last-child {
      border-bottom: none;
    }
    
    .nxt-option-group-label {
      padding: 8px 16px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background-color: #f5f5f5;
    }
    
    .nxt-option-group-content {
      /* Options will be rendered here */
    }
  `]
})
export class NxtOptionGroupComponent {
  @Input() label: string = '';
  
  @ContentChild(TemplateRef) labelTemplate?: TemplateRef<any>;
  
  get defaultLabelTemplate(): TemplateRef<any> {
    return null as any; // Will be handled in template
  }
} 
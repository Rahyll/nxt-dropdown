/**
 * Option Group Component
 * 
 * This component groups related options together in the dropdown.
 * It provides a visual separator and label for the group.
 * Can contain multiple nxt-option components as projected content.
 */
import { Component, Input, ContentChild, TemplateRef, ContentChildren, QueryList } from '@angular/core';
import { NxtOptionComponent } from '../nxt-option/nxt-option.component';

@Component({
  selector: 'nxt-option-group',
  template: `
    <!-- Main group container -->
    <div class="nxt-option-group">
      <!-- Group label section - only shown if label is provided -->
      <div class="nxt-option-group-label" *ngIf="label">
        <!-- Uses custom template if provided, otherwise uses default styling -->
        <ng-container *ngTemplateOutlet="labelTemplate || defaultLabelTemplate; context: { $implicit: label }">
        </ng-container>
      </div>
      <!-- Content area where projected options will be rendered -->
      <div class="nxt-option-group-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    /* Group container with bottom border for visual separation */
    .nxt-option-group {
      border-bottom: 1px solid #e0e0e0;
    }
    
    /* Remove border from last group to avoid double borders */
    .nxt-option-group:last-child {
      border-bottom: none;
    }
    
    /* Styling for the group label */
    .nxt-option-group-label {
      padding: 8px 16px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background-color: #f5f5f5;
    }
    
    /* Container for the actual options */
    .nxt-option-group-content {
      /* Options will be rendered here */
    }
  `]
})
export class NxtOptionGroupComponent {
  
  // ==================== INPUT PROPERTIES ====================
  
  /**
   * The label text to display for this group
   * Used as a header above the grouped options
   * Default: empty string
   */
  @Input() label: string = '';
  
  // ==================== CONTENT PROJECTION ====================
  
  /**
   * Optional custom template for the group label
   * Allows users to provide custom HTML for the label instead of plain text
   */
  @ContentChild(TemplateRef) labelTemplate?: TemplateRef<any>;
  
  /**
   * Query list of projected nxt-option components
   * Contains all option components that are projected into this group
   */
  @ContentChildren(NxtOptionComponent) optionComponents?: QueryList<NxtOptionComponent>;
  
  // ==================== GETTERS ====================
  
  /**
   * Default template for the group label
   * Returns null as the template is handled directly in the template
   * @returns TemplateRef<any> - null (handled in template)
   */
  get defaultLabelTemplate(): TemplateRef<any> {
    return null as any; // Will be handled in template
  }
  
  // ==================== PUBLIC METHODS ====================
  
  /**
   * Extracts all options from the projected option components
   * Ensures each option has the group label set
   * @returns Array of option objects with group information
   */
  getOptions(): any[] {
    if (!this.optionComponents) {
      return [];
    }
    
    return this.optionComponents.map(optionComp => {
      // Ensure the option has the group label set
      if (!optionComp.group) {
        optionComp.group = this.label;
      }
      
      return {
        value: optionComp.value,
        label: optionComp.option.label,
        disabled: optionComp.disabled,
        group: this.label
      };
    });
  }
} 
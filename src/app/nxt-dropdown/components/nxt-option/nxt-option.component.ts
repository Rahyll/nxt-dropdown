import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';

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
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NxtOptionComponent {
  @Input() value: any;
  @Input() disabled: boolean = false;
  @Input() group?: string;
  
  @Output() optionClick = new EventEmitter<NxtOptionValue>();
  
  get option(): NxtOptionValue {
    return {
      value: this.value,
      label: this.getDisplayText(),
      disabled: this.disabled,
      group: this.group
    };
  }
  
  private getDisplayText(): string {
    // Get the text content from the projected content
    const element = this.elementRef.nativeElement;
    return element.textContent?.trim() || '';
  }
  
  constructor(private elementRef: ElementRef) {}
  
  onClick(): void {
    if (!this.disabled) {
      this.optionClick.emit(this.option);
    }
  }
} 
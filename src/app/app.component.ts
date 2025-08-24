/**
 * Main Application Component
 * 
 * This is the root component of the Angular application.
 * It serves as the entry point and contains the main application structure.
 * The component displays the Angular version and hosts the dropdown demo.
 */
import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /**
   * Application name with Angular version
   * Used for display purposes in the application header
   */

  triggerValue : string = 'option1';

  groups = [
    { label: 'Group 1', options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ] },
    { label: 'Group 2', options: [
      { value: 'option4', label: 'Option 4' },
      { value: 'option5', label: 'Option 5' },
    ] },
    { label: 'Group 3', options: [
      { value: 'option6', label: 'Option 6' },
      { value: 'option7', label: 'Option 7' },
    ] },
  ];
    

  options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];
}

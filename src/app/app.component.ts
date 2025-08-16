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
  name = 'Angular ' + VERSION.major;
}

/**
 * Hello Component
 * 
 * A simple greeting component that displays a personalized hello message.
 * This component accepts a name input and displays it in a greeting format.
 * Used as a basic example component in the application.
 */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'hello',
  template: `<h1>Hello {{name}}!</h1>`,
  styles: [`h1 { font-family: Lato; }`]
})
export class HelloComponent  {
  /**
   * Input property for the name to display in the greeting
   * The name will be interpolated into the template
   */
  @Input() name: string;
}

# NXT Dropdown Component

A custom Angular select component with Control Value Accessor implementation that integrates seamlessly with Angular's form system.

## Features

- ✅ Control Value Accessor implementation
- ✅ Template-driven forms support
- ✅ Reactive forms support
- ✅ Single and multiple selection
- ✅ Required field validation
- ✅ Disabled state support
- ✅ Custom placeholder text
- ✅ Disabled options support
- ✅ Material Design styling
- ✅ Responsive design
- ✅ Search functionality with filtering
- ✅ Confirmation mode for multiple selection

## Installation

The component is already included in your Angular project. Make sure you have the following dependencies:

```json
{
  "@angular/material": "^15.0.2",
  "@angular/forms": "^15.0.3"
}
```

## Usage

The component supports two configuration approaches:

### 1. Direct Input Properties (Traditional Approach)

```html
<nxt-dropdown
  [options]="options"
  placeholder="Select an option">
</nxt-dropdown>
```

### 2. Configuration Object (New Approach)

```html
<nxt-dropdown
  [config]="dropdownConfig">
</nxt-dropdown>
```

```typescript
const dropdownConfig: NxtDropdownConfig = {
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ],
  placeholder: 'Select an option',
  multiple: true,
  searchable: true
};
```

### 3. Mixed Approach (Config + Override)

```html
<nxt-dropdown
  [config]="baseConfig"
  [placeholder]="'Overridden placeholder'"
  [required]="true">
</nxt-dropdown>
```

**Note:** Direct input properties take precedence over configuration object properties.

### Template-Driven Forms

```html
<nxt-dropdown
  [(ngModel)]="selectedValue"
  [options]="options"
  placeholder="Select an option">
</nxt-dropdown>
```

### Reactive Forms

```html
<form [formGroup]="form">
  <nxt-dropdown
    formControlName="selectField"
    [options]="options"
    placeholder="Select an option">
  </nxt-dropdown>
</form>
```

### Multiple Selection

```html
<nxt-dropdown
  [(ngModel)]="selectedValues"
  [options]="options"
  [multiple]="true"
  placeholder="Select multiple options">
</nxt-dropdown>
```

### Required Field

```html
<nxt-dropdown
  [(ngModel)]="selectedValue"
  [options]="options"
  [required]="true"
  placeholder="Required field">
</nxt-dropdown>
```

### Disabled State

```html
<nxt-dropdown
  [options]="options"
  [disabled]="true"
  placeholder="Disabled select">
</nxt-dropdown>
```

### Search Functionality

```html
<nxt-dropdown
  [(ngModel)]="selectedValue"
  [options]="options"
  [searchable]="true"
  searchPlaceholder="Type to search..."
  [minSearchLength]="2"
  placeholder="Searchable select">
</nxt-dropdown>
```

### Confirmation Mode

```html
<nxt-dropdown
  [(ngModel)]="selectedValues"
  [options]="options"
  [multiple]="true"
  [confirmation]="true"
  placeholder="Select with confirmation">
</nxt-dropdown>
```

### Icon Types

The component supports three different icon types for the dropdown arrow:

```html
<!-- Default caret icon (chevron) -->
<nxt-dropdown
  [iconType]="'caret'"
  [options]="options"
  placeholder="Select with caret icon">
</nxt-dropdown>

<!-- Down arrow icon -->
<nxt-dropdown
  [iconType]="'arrow'"
  [options]="options"
  placeholder="Select with arrow icon">
</nxt-dropdown>

<!-- Sharp-cornered triangle caret -->
<nxt-dropdown
  [iconType]="'sharp-caret'"
  [options]="options"
  placeholder="Select with sharp caret icon">
</nxt-dropdown>
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `options` | `NxtDropdownOption[]` | `[]` | Array of options to display |
| `placeholder` | `string` | `'Select an option'` | Placeholder text |
| `disabled` | `boolean` | `false` | Whether the select is disabled |
| `required` | `boolean` | `false` | Whether the field is required |
| `multiple` | `boolean` | `false` | Whether multiple selection is allowed |
| `confirmation` | `boolean` | `false` | Whether to show confirmation buttons for multiple selection |
| `searchable` | `boolean` | `false` | Whether to enable search functionality |
| `searchPlaceholder` | `string` | `'Search options...'` | Placeholder text for search input |
| `minSearchLength` | `number` | `0` | Minimum characters required to start filtering |
| `iconType` | `'caret' \| 'arrow' \| 'sharp-caret'` | `'caret'` | Type of dropdown icon |
| `panelClass` | `string` | `''` | CSS class for the dropdown panel |
| `config` | `NxtDropdownConfig` | `{}` | Configuration object (alternative to individual properties) |

## Output Events

| Event | Type | Description |
|-------|------|-------------|
| `selectionChange` | `EventEmitter<any>` | Emitted when selection changes |

## Interfaces

### NxtDropdownOption Interface

```typescript
interface NxtDropdownOption {
  value: any;        // The value of the option
  label: string;     // The display text
  disabled?: boolean; // Whether the option is disabled
}
```

### NxtDropdownConfig Interface

```typescript
interface NxtDropdownConfig {
  options?: NxtDropdownOption[];    // Array of options
  placeholder?: string;             // Placeholder text
  disabled?: boolean;               // Disable the component
  required?: boolean;               // Mark as required
  multiple?: boolean;               // Enable multiple selection
  confirmation?: boolean;           // Show confirmation buttons
  panelClass?: string;              // Additional CSS class
  searchable?: boolean;             // Enable search functionality
  searchPlaceholder?: string;       // Search input placeholder
  minSearchLength?: number;         // Minimum search length
  iconType?: 'caret' | 'arrow' | 'sharp-caret'; // Type of dropdown icon
}
```

## Example

```typescript
import { Component } from '@angular/core';
import { NxtDropdownOption, NxtDropdownConfig } from './nxt-dropdown/nxt-dropdown.component';

@Component({
  selector: 'app-example',
  template: `
    <!-- Direct properties approach -->
    <nxt-dropdown
      [(ngModel)]="selectedCountry"
      [options]="countries"
      placeholder="Select your country"
      (selectionChange)="onCountryChange($event)">
    </nxt-dropdown>

    <!-- Configuration object approach -->
    <nxt-dropdown
      [(ngModel)]="selectedCountries"
      [config]="dropdownConfig"
      (selectionChange)="onCountriesChange($event)">
    </nxt-dropdown>
  `
})
export class ExampleComponent {
  selectedCountry: string = '';
  selectedCountries: string[] = [];
  
  countries: NxtDropdownOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' }
  ];

  dropdownConfig: NxtDropdownConfig = {
    options: this.countries,
    placeholder: 'Select multiple countries',
    multiple: true,
    confirmation: true,
    searchable: true,
    searchPlaceholder: 'Search countries...'
  };

  onCountryChange(value: string) {
    console.log('Selected country:', value);
  }

  onCountriesChange(values: string[]) {
    console.log('Selected countries:', values);
  }
}
```

## Styling

The component uses Angular Material's styling system. You can customize the appearance by overriding the CSS classes:

- `.nxt-dropdown-field` - Main container
- `.nxt-dropdown-panel` - Dropdown panel

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- Angular 15+
- Angular Material 15+
- Angular Forms 
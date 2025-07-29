# NTX Select Component

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

### Basic Usage

```html
<ntx-select
  [options]="options"
  placeholder="Select an option">
</ntx-select>
```

### Template-Driven Forms

```html
<ntx-select
  [(ngModel)]="selectedValue"
  [options]="options"
  placeholder="Select an option">
</ntx-select>
```

### Reactive Forms

```html
<form [formGroup]="form">
  <ntx-select
    formControlName="selectField"
    [options]="options"
    placeholder="Select an option">
  </ntx-select>
</form>
```

### Multiple Selection

```html
<ntx-select
  [(ngModel)]="selectedValues"
  [options]="options"
  [multiple]="true"
  placeholder="Select multiple options">
</ntx-select>
```

### Required Field

```html
<ntx-select
  [(ngModel)]="selectedValue"
  [options]="options"
  [required]="true"
  placeholder="Required field">
</ntx-select>
```

### Disabled State

```html
<ntx-select
  [options]="options"
  [disabled]="true"
  placeholder="Disabled select">
</ntx-select>
```

### Search Functionality

```html
<ntx-select
  [(ngModel)]="selectedValue"
  [options]="options"
  [searchable]="true"
  searchPlaceholder="Type to search..."
  [minSearchLength]="2"
  placeholder="Searchable select">
</ntx-select>
```

### Confirmation Mode

```html
<ntx-select
  [(ngModel)]="selectedValues"
  [options]="options"
  [multiple]="true"
  [confirmation]="true"
  placeholder="Select with confirmation">
</ntx-select>
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `options` | `NtxSelectOption[]` | `[]` | Array of options to display |
| `placeholder` | `string` | `'Select an option'` | Placeholder text |
| `disabled` | `boolean` | `false` | Whether the select is disabled |
| `required` | `boolean` | `false` | Whether the field is required |
| `multiple` | `boolean` | `false` | Whether multiple selection is allowed |
| `confirmation` | `boolean` | `false` | Whether to show confirmation buttons for multiple selection |
| `searchable` | `boolean` | `false` | Whether to enable search functionality |
| `searchPlaceholder` | `string` | `'Search options...'` | Placeholder text for search input |
| `minSearchLength` | `number` | `0` | Minimum characters required to start filtering |
| `panelClass` | `string` | `''` | CSS class for the dropdown panel |

## Output Events

| Event | Type | Description |
|-------|------|-------------|
| `selectionChange` | `EventEmitter<any>` | Emitted when selection changes |

## NtxSelectOption Interface

```typescript
interface NtxSelectOption {
  value: any;        // The value of the option
  label: string;     // The display text
  disabled?: boolean; // Whether the option is disabled
}
```

## Example

```typescript
import { Component } from '@angular/core';
import { NtxSelectOption } from './ntx-select/ntx-select.component';

@Component({
  selector: 'app-example',
  template: `
    <ntx-select
      [(ngModel)]="selectedCountry"
      [options]="countries"
      placeholder="Select your country"
      (selectionChange)="onCountryChange($event)">
    </ntx-select>
  `
})
export class ExampleComponent {
  selectedCountry: string = '';
  
  countries: NtxSelectOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' }
  ];

  onCountryChange(value: string) {
    console.log('Selected country:', value);
  }
}
```

## Styling

The component uses Angular Material's styling system. You can customize the appearance by overriding the CSS classes:

- `.ntx-select-field` - Main container
- `.ntx-select-panel` - Dropdown panel

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- Angular 15+
- Angular Material 15+
- Angular Forms 
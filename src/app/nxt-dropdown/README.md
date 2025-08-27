# NXT Dropdown Component

A comprehensive Angular dropdown component with Control Value Accessor implementation that integrates seamlessly with Angular's form system. Features include content projection, custom triggers, search functionality, and advanced selection modes.

## 🚀 Features

- ✅ Control Value Accessor implementation
- ✅ Template-driven and Reactive forms support
- ✅ Single and multiple selection modes
- ✅ Content projection for declarative option definition
- ✅ Custom triggers for complete UI customization
- ✅ Search functionality with configurable filtering
- ✅ Confirmation mode for multiple selections
- ✅ Required field validation
- ✅ Disabled state support
- ✅ Material Design styling
- ✅ Responsive design with touch optimization
- ✅ Accessibility (WCAG 2.1 compliant)
- ✅ TypeScript support with full type safety

## 📦 Installation

The component is already included in your Angular project. Ensure you have the required dependencies:

```json
{
  "@angular/material": "^15.0.2",
  "@angular/forms": "^15.0.3"
}
```

## 🎯 Quick Start

### Basic Usage (Array Approach)

```html
<nxt-dropdown
  [(ngModel)]="selectedValue"
  [options]="options"
  placeholder="Select an option">
</nxt-dropdown>
```

```typescript
options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3', disabled: true }
];
```

### Content Projection (Recommended)

```html
<nxt-dropdown [(ngModel)]="selectedValue" placeholder="Select an option">
  <nxt-option value="option1">Option 1</nxt-option>
  <nxt-option value="option2">Option 2</nxt-option>
  <nxt-option value="option3" [disabled]="true">Option 3 (Disabled)</nxt-option>
</nxt-dropdown>
```

## 📋 Usage Examples

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

## 🎨 Content Projection

The component supports content projection, allowing you to define options declaratively in your template, similar to Angular Material's `mat-select` and `mat-option`.

### Basic Content Projection

```html
<nxt-dropdown [(ngModel)]="selectedValue" placeholder="Select an option">
  <nxt-option value="option1">Option 1</nxt-option>
  <nxt-option value="option2">Option 2</nxt-option>
  <nxt-option value="option3" [disabled]="true">Option 3 (Disabled)</nxt-option>
</nxt-dropdown>
```

### Rich Content Options

```html
<nxt-dropdown [(ngModel)]="selectedValue" placeholder="Select with rich content">
  <nxt-option value="js">
    <span style="color: #f7df1e;">⚡</span> JavaScript
    <br><small style="color: #666;">Web development language</small>
  </nxt-option>
  <nxt-option value="ts">
    <span style="color: #3178c6;">🔷</span> TypeScript
    <br><small style="color: #666;">Typed JavaScript</small>
  </nxt-option>
</nxt-dropdown>
```

### Option Groups

```html
<nxt-dropdown [(ngModel)]="selectedValue" placeholder="Select from groups">
  <nxt-option-group label="Fruits">
    <nxt-option value="apple">🍎 Apple</nxt-option>
    <nxt-option value="banana">🍌 Banana</nxt-option>
    <nxt-option value="orange">🍊 Orange</nxt-option>
  </nxt-option-group>
  <nxt-option-group label="Vegetables">
    <nxt-option value="carrot">🥕 Carrot</nxt-option>
    <nxt-option value="broccoli">🥦 Broccoli</nxt-option>
    <nxt-option value="spinach">🥬 Spinach</nxt-option>
  </nxt-option-group>
</nxt-dropdown>
```

### Dynamic Options

```html
<nxt-dropdown [(ngModel)]="selectedValue">
  <nxt-option *ngFor="let item of items" [value]="item.value">
    <span style="font-weight: bold;">{{ item.label }}</span>
    <br><small style="color: #666;">{{ item.description }}</small>
  </nxt-option>
</nxt-dropdown>
```

## 🎛️ Custom Triggers

Create completely custom trigger designs while maintaining all dropdown functionality.

### Basic Custom Trigger

```html
<nxt-dropdown [(ngModel)]="selectedValue">
  <nxt-dropdown-trigger>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="color: #1976d2;">🎯</span>
      <span>{{ selectedValue ? 'Selected: ' + selectedValue : 'Click to select' }}</span>
    </div>
  </nxt-dropdown-trigger>
  <nxt-option value="option1">Option 1</nxt-option>
  <nxt-option value="option2">Option 2</nxt-option>
</nxt-dropdown>
```

### Custom Trigger without Arrow

```html
<nxt-dropdown [(ngModel)]="selectedValue">
  <nxt-dropdown-trigger [showArrow]="false">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="color: #ff9800;">⭐</span>
      <span>{{ selectedValue ? 'Rating: ' + selectedValue : 'Select rating' }}</span>
    </div>
  </nxt-dropdown-trigger>
  <nxt-option value="1">1 Star</nxt-option>
  <nxt-option value="2">2 Stars</nxt-option>
</nxt-dropdown>
```

### Rich Custom Trigger with Avatar

```html
<nxt-dropdown [(ngModel)]="selectedCountry">
  <nxt-dropdown-trigger>
    <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
      <div style="width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(45deg, #1976d2, #42a5f5); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">
        {{ selectedCountry ? selectedCountry.charAt(0).toUpperCase() : '?' }}
      </div>
      <div style="flex: 1;">
        <div style="font-weight: 500;">{{ selectedCountry ? 'Country Selected' : 'Select Country' }}</div>
        <div style="font-size: 12px; color: #666;">{{ selectedCountry || 'Click to choose' }}</div>
      </div>
    </div>
  </nxt-dropdown-trigger>
  <nxt-option value="us">United States</nxt-option>
  <nxt-option value="uk">United Kingdom</nxt-option>
</nxt-dropdown>
```

## ⚙️ Configuration

The component supports two configuration approaches:

### 1. Direct Input Properties (Traditional)

```html
<nxt-dropdown
  [options]="options"
  placeholder="Select an option">
</nxt-dropdown>
```

### 2. Configuration Object (New)

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

## 🎨 Custom Confirmation Buttons

When `confirmation` is true, you can customize the button text and icons:

### Emoji/Unicode Icons

```html
<nxt-dropdown
  [(ngModel)]="selectedValues"
  [options]="options"
  [multiple]="true"
  [confirmation]="true"
  applyButtonText="Save Selection"
  applyButtonIcon="💾"
  cancelButtonText="Discard Changes"
  cancelButtonIcon="🗑️"
  placeholder="Select with custom buttons">
</nxt-dropdown>
```

### Font Awesome Icons

```html
<nxt-dropdown
  [(ngModel)]="selectedValues"
  [options]="options"
  [multiple]="true"
  [confirmation]="true"
  applyButtonText="Save"
  applyButtonIcon="<i class='fas fa-check'></i>"
  cancelButtonText="Cancel"
  cancelButtonIcon="<i class='fas fa-times'></i>"
  placeholder="Select with font icons">
</nxt-dropdown>
```

### Material Icons

```html
<nxt-dropdown
  [(ngModel)]="selectedValues"
  [options]="options"
  [multiple]="true"
  [confirmation]="true"
  applyButtonText="Confirm"
  applyButtonIcon="<span class='material-icons'>check</span>"
  cancelButtonText="Cancel"
  cancelButtonIcon="<span class='material-icons'>close</span>"
  placeholder="Select with Material icons">
</nxt-dropdown>
```

### Configuration Object Approach

```html
<nxt-dropdown
  [(ngModel)]="selectedValues"
  [config]="{
    options: options,
    multiple: true,
    confirmation: true,
    confirmationButtons: {
      apply: { text: 'Done', icon: '🎯' },
      cancel: { text: 'Reset', icon: '🔄' }
    }
  }">
</nxt-dropdown>
```

## 🎯 Icon Types

The component supports different icon types for the dropdown arrow:

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

## 📋 API Reference

### Input Properties

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
| `applyButtonText` | `string` | `'Apply'` | Custom text for the apply button in confirmation mode |
| `applyButtonIcon` | `string` | `''` | Custom icon for the apply button |
| `cancelButtonText` | `string` | `'Cancel'` | Custom text for the cancel button in confirmation mode |
| `cancelButtonIcon` | `string` | `''` | Custom icon for the cancel button |
| `panelClass` | `string` | `''` | CSS class for the dropdown panel |
| `config` | `NxtDropdownConfig` | `{}` | Configuration object (alternative to individual properties) |

### Output Events

| Event | Type | Description |
|-------|------|-------------|
| `selectionChange` | `EventEmitter<any>` | Emitted when selection changes |

### Content Projection Components

#### NxtOptionComponent

```typescript
@Component({
  selector: 'nxt-option',
  template: '<ng-content></ng-content>'
})
export class NxtOptionComponent {
  @Input() value: any;           // The value of the option
  @Input() disabled: boolean;    // Whether the option is disabled
  @Input() group?: string;       // Group label for grouped options
}
```

#### NxtOptionGroupComponent

```typescript
@Component({
  selector: 'nxt-option-group',
  // ...
})
export class NxtOptionGroupComponent {
  @Input() label: string;        // Group label
}
```

#### NxtDropdownTriggerComponent

```typescript
@Component({
  selector: 'nxt-dropdown-trigger',
  // ...
})
export class NxtDropdownTriggerComponent {
  @Input() disabled: boolean;    // Whether the trigger is disabled
  @Input() isOpen: boolean;      // Whether the dropdown is open
  @Input() required: boolean;    // Whether the field is required
  @Input() multiple: boolean;    // Whether multiple selection is enabled
  @Input() placeholder: string;  // Placeholder text
  @Input() showArrow: boolean;   // Whether to show the dropdown arrow
}
```

## 🔧 Interfaces

### NxtDropdownOption Interface

```typescript
interface NxtDropdownOption {
  value: any;        // The value of the option
  label: string;     // The display text
  disabled?: boolean; // Whether the option is disabled
  group?: string;    // Group label for grouped options
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
  confirmationButtons?: {
    apply?: {
      text?: string;
      icon?: string;
    };
    cancel?: {
      text?: string;
      icon?: string;
    };
  };
}
```

## 🎨 Styling

The component uses Angular Material's styling system. You can customize the appearance by overriding the CSS classes:

```scss
.nxt-dropdown-field {
  // Main container styles
}

.nxt-dropdown-panel {
  // Dropdown panel styles
}

.nxt-dropdown-trigger-content {
  // Custom trigger styles
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;

  &:hover:not(.disabled) {
    border-color: #999;
  }

  &:focus {
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }

  &.disabled {
    background-color: #f5f5f5;
    color: #999;
    cursor: not-allowed;
    border-color: #e0e0e0;
  }

  &.open {
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }

  &.required {
    border-left: 3px solid #d32f2f;
  }
}
```

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔍 Accessibility Features

- ARIA attributes for screen readers
- Keyboard navigation support
- Focus management
- High contrast support
- Screen reader announcements
- WCAG 2.1 AA compliance

## 📊 Performance

- Optimized for 1000+ items
- Efficient memory management
- Smooth animations
- Touch-optimized performance
- Virtual scrolling support for large datasets

## 🛠️ Complete Example

```typescript
import { Component } from '@angular/core';
import { NxtDropdownOption, NxtDropdownConfig } from './nxt-dropdown/nxt-dropdown.component';

@Component({
  selector: 'app-example',
  template: `
    <!-- Content projection approach -->
    <nxt-dropdown [(ngModel)]="selectedValue" placeholder="Select an option">
      <nxt-option value="option1">Option 1</nxt-option>
      <nxt-option value="option2">Option 2</nxt-option>
      <nxt-option value="option3" [disabled]="true">Option 3 (Disabled)</nxt-option>
    </nxt-dropdown>

    <!-- Multiple selection with confirmation -->
    <nxt-dropdown
      [(ngModel)]="selectedValues"
      [multiple]="true"
      [confirmation]="true"
      placeholder="Select multiple options">
      <nxt-option value="item1">Item 1</nxt-option>
      <nxt-option value="item2">Item 2</nxt-option>
      <nxt-option value="item3">Item 3</nxt-option>
    </nxt-dropdown>

    <!-- Custom trigger -->
    <nxt-dropdown [(ngModel)]="selectedCountry">
      <nxt-dropdown-trigger>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: #1976d2;">🌍</span>
          <span>{{ selectedCountry || 'Select Country' }}</span>
        </div>
      </nxt-dropdown-trigger>
      <nxt-option value="us">United States</nxt-option>
      <nxt-option value="uk">United Kingdom</nxt-option>
    </nxt-dropdown>
  `
})
export class ExampleComponent {
  selectedValue: string = '';
  selectedValues: string[] = [];
  selectedCountry: string = '';
}
```

## 📝 Migration Guide

### From Array to Content Projection

**Before (Array approach):**
```html
<nxt-dropdown [(ngModel)]="selectedValue" [options]="options"></nxt-dropdown>
```

**After (Content projection):**
```html
<nxt-dropdown [(ngModel)]="selectedValue">
  <nxt-option value="option1">Option 1</nxt-option>
  <nxt-option value="option2">Option 2</nxt-option>
</nxt-dropdown>
```

The component supports both approaches simultaneously, so you can migrate gradually.

## 🐛 Troubleshooting

### Common Issues

1. **Options not displaying**: Ensure the `options` array is properly initialized
2. **Form validation not working**: Check that the component is properly integrated with Angular forms
3. **Styling issues**: Verify that Angular Material styles are included in your project
4. **Accessibility problems**: Ensure proper ARIA attributes are being set

### Performance Tips

1. Use content projection for static options
2. Use array approach for dynamic data from APIs
3. Consider virtual scrolling for large datasets (1000+ options)
4. Implement proper change detection strategies

## 📚 Additional Resources

- [Angular Forms Guide](https://angular.io/guide/forms)
- [Material Design Guidelines](https://material.io/design)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Angular Component Best Practices](https://angular.io/guide/styleguide)

---

*This comprehensive component provides all the functionality you need for dropdown/select components in Angular applications, with a focus on accessibility, performance, and developer experience.* 
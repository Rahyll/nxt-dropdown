# NXT Dropdown Content Projection

The NXT Dropdown component now supports content projection, allowing you to specify options as child elements similar to how `mat-select` and `mat-option` work in Angular Material.

## Overview

Content projection provides a more declarative way to define dropdown options, making the template more readable and allowing for better IDE support and type checking.

## Components

### NxtOptionComponent

The `nxt-option` component represents a single option in the dropdown.

```typescript
@Component({
  selector: 'nxt-option',
  // ...
})
export class NxtOptionComponent {
  @Input() value: any;           // The value of the option
  @Input() label: string;        // Display text for the option
  @Input() disabled: boolean;    // Whether the option is disabled
  @Input() group?: string;       // Group label for grouped options
  @Input() icon?: string;        // Icon class or URL
  @Input() description?: string; // Additional description text
}
```

### NxtOptionGroupComponent

The `nxt-option-group` component groups related options together.

```typescript
@Component({
  selector: 'nxt-option-group',
  // ...
})
export class NxtOptionGroupComponent {
  @Input() label: string;        // Group label
}
```

## Usage Examples

### Basic Options

```html
<nxt-dropdown [(ngModel)]="selectedValue" placeholder="Select an option">
  <nxt-option value="option1" label="Option 1"></nxt-option>
  <nxt-option value="option2" label="Option 2"></nxt-option>
  <nxt-option value="option3" label="Option 3" [disabled]="true"></nxt-option>
  <nxt-option value="option4" label="Option 4"></nxt-option>
</nxt-dropdown>
```

### Multiple Selection

```html
<nxt-dropdown [(ngModel)]="selectedValues" [multiple]="true" placeholder="Select multiple options">
  <nxt-option value="fruit1" label="Apple" description="Red and delicious"></nxt-option>
  <nxt-option value="fruit2" label="Banana" description="Yellow and sweet"></nxt-option>
  <nxt-option value="fruit3" label="Orange" description="Citrus fruit"></nxt-option>
  <nxt-option value="fruit4" label="Grape" description="Small and purple"></nxt-option>
</nxt-dropdown>
```

### With Option Groups

```html
<nxt-dropdown [(ngModel)]="selectedValue" placeholder="Select from grouped options">
  <nxt-option-group label="Fruits">
    <nxt-option value="apple" label="Apple"></nxt-option>
    <nxt-option value="banana" label="Banana"></nxt-option>
    <nxt-option value="orange" label="Orange"></nxt-option>
  </nxt-option-group>
  <nxt-option-group label="Vegetables">
    <nxt-option value="carrot" label="Carrot"></nxt-option>
    <nxt-option value="broccoli" label="Broccoli"></nxt-option>
    <nxt-option value="spinach" label="Spinach"></nxt-option>
  </nxt-option-group>
</nxt-dropdown>
```

### Searchable with Groups

```html
<nxt-dropdown [(ngModel)]="selectedValues" 
              [searchable]="true" 
              [multiple]="true" 
              placeholder="Search and select from groups">
  <nxt-option-group label="Programming Languages">
    <nxt-option value="js" label="JavaScript" description="Web development"></nxt-option>
    <nxt-option value="ts" label="TypeScript" description="Typed JavaScript"></nxt-option>
    <nxt-option value="py" label="Python" description="General purpose"></nxt-option>
    <nxt-option value="java" label="Java" description="Enterprise development"></nxt-option>
  </nxt-option-group>
  <nxt-option-group label="Frameworks">
    <nxt-option value="angular" label="Angular" description="Google's framework"></nxt-option>
    <nxt-option value="react" label="React" description="Facebook's library"></nxt-option>
    <nxt-option value="vue" label="Vue.js" description="Progressive framework"></nxt-option>
    <nxt-option value="svelte" label="Svelte" description="Compile-time framework"></nxt-option>
  </nxt-option-group>
</nxt-dropdown>
```

### With Confirmation

```html
<nxt-dropdown [(ngModel)]="selectedValues" 
              [multiple]="true" 
              [confirmation]="true" 
              placeholder="Select with confirmation">
  <nxt-option value="item1" label="Item 1" description="First item"></nxt-option>
  <nxt-option value="item2" label="Item 2" description="Second item"></nxt-option>
  <nxt-option value="item3" label="Item 3" description="Third item"></nxt-option>
</nxt-dropdown>
```

## Features

### Description Support

Options can include descriptions that provide additional context:

```html
<nxt-option value="js" label="JavaScript" description="Web development language"></nxt-option>
```

### Disabled Options

Options can be disabled individually:

```html
<nxt-option value="disabled" label="Disabled Option" [disabled]="true"></nxt-option>
```

### Dynamic Options

You can dynamically generate options using `*ngFor`:

```html
<nxt-dropdown [(ngModel)]="selectedValue">
  <nxt-option *ngFor="let item of items" 
               [value]="item.value" 
               [label]="item.label"
               [description]="item.description">
  </nxt-option>
</nxt-dropdown>
```

## Comparison with Array Approach

### Content Projection (New)
```html
<nxt-dropdown [(ngModel)]="selectedValue">
  <nxt-option value="option1" label="Option 1"></nxt-option>
  <nxt-option value="option2" label="Option 2"></nxt-option>
</nxt-dropdown>
```

### Array Approach (Traditional)
```html
<nxt-dropdown [(ngModel)]="selectedValue" [options]="options"></nxt-dropdown>
```

```typescript
options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' }
];
```

## Benefits

1. **Better IDE Support**: TypeScript can provide better autocomplete and type checking
2. **More Readable Templates**: Options are clearly visible in the template
3. **Easier Maintenance**: No need to maintain separate arrays
4. **Dynamic Content**: Easy to add conditional options
5. **Better Accessibility**: Screen readers can better understand the structure

## Limitations

1. **Performance**: For very large datasets (1000+ options), the array approach might be more performant
2. **Complex Filtering**: Advanced filtering logic is easier to implement with arrays
3. **Server-side Data**: When options come from an API, the array approach is more natural

## Best Practices

1. Use content projection for static or semi-static options
2. Use the array approach for dynamic data from APIs
3. Consider performance implications for large datasets
4. Use option groups to organize related options
5. Provide meaningful descriptions for better UX

## Migration

To migrate from array-based options to content projection:

1. Replace the `[options]` input with child `nxt-option` elements
2. Move option properties to the component inputs
3. Update any dynamic option generation to use `*ngFor`
4. Test thoroughly to ensure the same functionality

The component supports both approaches simultaneously, so you can migrate gradually. 
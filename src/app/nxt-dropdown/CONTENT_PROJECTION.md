# NXT Dropdown Content Projection

The NXT Dropdown component now supports content projection, allowing you to specify options as child elements similar to how `mat-select` and `mat-option` work in Angular Material.

## Overview

Content projection provides a more declarative way to define dropdown options, making the template more readable and allowing for better IDE support and type checking.

## Components

### NxtOptionComponent

The `nxt-option` component represents a single option in the dropdown. It uses content projection to allow flexible content inside the option tags.

```typescript
@Component({
  selector: 'nxt-option',
  template: '<ng-content></ng-content>'
})
export class NxtOptionComponent {
  @Input() value: any;           // The value of the option
  @Input() disabled: boolean;    // Whether the option is disabled
  @Input() group?: string;       // Group label for grouped options
  // Content is projected via ng-content
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
  <nxt-option value="option1">Option 1</nxt-option>
  <nxt-option value="option2">Option 2</nxt-option>
  <nxt-option value="option3" [disabled]="true">Option 3 (Disabled)</nxt-option>
  <nxt-option value="option4">Option 4</nxt-option>
</nxt-dropdown>
```

### Multiple Selection

```html
<nxt-dropdown [(ngModel)]="selectedValues" [multiple]="true" placeholder="Select multiple options">
  <nxt-option value="fruit1">
    <span style="font-weight: bold;">🍎 Apple</span>
    <br><small style="color: #666;">Red and delicious</small>
  </nxt-option>
  <nxt-option value="fruit2">
    <span style="font-weight: bold;">🍌 Banana</span>
    <br><small style="color: #666;">Yellow and sweet</small>
  </nxt-option>
  <nxt-option value="fruit3">
    <span style="font-weight: bold;">🍊 Orange</span>
    <br><small style="color: #666;">Citrus fruit</small>
  </nxt-option>
  <nxt-option value="fruit4">
    <span style="font-weight: bold;">🍇 Grape</span>
    <br><small style="color: #666;">Small and purple</small>
  </nxt-option>
</nxt-dropdown>
```

### With Option Groups

```html
<nxt-dropdown [(ngModel)]="selectedValue" placeholder="Select from grouped options">
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

### Searchable with Groups

```html
<nxt-dropdown [(ngModel)]="selectedValues" 
              [searchable]="true" 
              [multiple]="true" 
              placeholder="Search and select from groups">
  <nxt-option-group label="Programming Languages">
    <nxt-option value="js">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="color: #f7df1e;">⚡</span>
        <div>
          <div style="font-weight: bold;">JavaScript</div>
          <div style="font-size: 0.8em; color: #666;">Web development</div>
        </div>
      </div>
    </nxt-option>
    <nxt-option value="ts">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="color: #3178c6;">🔷</span>
        <div>
          <div style="font-weight: bold;">TypeScript</div>
          <div style="font-size: 0.8em; color: #666;">Typed JavaScript</div>
        </div>
      </div>
    </nxt-option>
  </nxt-option-group>
</nxt-dropdown>
```

### With Confirmation

```html
<nxt-dropdown [(ngModel)]="selectedValues" 
              [multiple]="true" 
              [confirmation]="true" 
              placeholder="Select with confirmation">
  <nxt-option value="item1">
    <span style="font-weight: bold;">📦 Item 1</span>
    <br><small style="color: #666;">First item</small>
  </nxt-option>
  <nxt-option value="item2">
    <span style="font-weight: bold;">📦 Item 2</span>
    <br><small style="color: #666;">Second item</small>
  </nxt-option>
  <nxt-option value="item3">
    <span style="font-weight: bold;">📦 Item 3</span>
    <br><small style="color: #666;">Third item</small>
  </nxt-option>
</nxt-dropdown>
```

## Features

### Rich Content Support

Options can include any HTML content for rich displays:

```html
<nxt-option value="js">
  <span style="color: #f7df1e;">⚡</span> JavaScript
  <br><small style="color: #666;">Web development language</small>
</nxt-option>
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
  <nxt-option *ngFor="let item of items" [value]="item.value">
    <span style="font-weight: bold;">{{ item.label }}</span>
    <br><small style="color: #666;">{{ item.description }}</small>
  </nxt-option>
</nxt-dropdown>
```

## Comparison with Array Approach

### Content Projection (New)
```html
<nxt-dropdown [(ngModel)]="selectedValue">
  <nxt-option value="option1">Option 1</nxt-option>
  <nxt-option value="option2">Option 2</nxt-option>
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
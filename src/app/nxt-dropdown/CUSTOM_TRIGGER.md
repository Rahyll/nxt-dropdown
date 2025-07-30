# Custom Trigger Functionality

The NXT Dropdown component now supports custom triggers, similar to Angular Material's `mat-select-trigger`. This allows you to completely customize the appearance and behavior of the dropdown trigger while maintaining all the dropdown functionality.

## Basic Usage

```html
<nxt-dropdown [(ngModel)]="selectedValue" [options]="options">
  <nxt-dropdown-trigger>
    <!-- Your custom trigger content here -->
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="color: #1976d2;">🎯</span>
      <span>{{ selectedValue ? 'Selected: ' + selectedValue : 'Click to select' }}</span>
    </div>
  </nxt-dropdown-trigger>
</nxt-dropdown>
```

## Trigger Component Properties

The `nxt-dropdown-trigger` component accepts the following inputs:

- `disabled: boolean` - Whether the trigger is disabled
- `isOpen: boolean` - Whether the dropdown is open
- `required: boolean` - Whether the field is required
- `multiple: boolean` - Whether multiple selection is enabled
- `placeholder: string` - Placeholder text
- `showArrow: boolean` - Whether to show the dropdown arrow (default: true)

## Examples

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

### Status Indicator Trigger
```html
<nxt-dropdown [(ngModel)]="selectedStatus">
  <nxt-dropdown-trigger>
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #4caf50;"></div>
        <span>{{ selectedStatus ? 'Active: ' + selectedStatus : 'Select status' }}</span>
      </div>
      <span style="font-size: 12px; color: #666;">Status</span>
    </div>
  </nxt-dropdown-trigger>
  <nxt-option value="active">Active</nxt-option>
  <nxt-option value="inactive">Inactive</nxt-option>
</nxt-dropdown>
```

## How It Works

1. **Content Projection**: The `nxt-dropdown-trigger` component uses `ng-content` to project your custom content.

2. **Event Handling**: The trigger component automatically handles click and keyboard events, forwarding them to the parent dropdown component.

3. **State Synchronization**: The trigger component receives the current dropdown state (open/closed, disabled, etc.) and can react accordingly.

4. **Accessibility**: The trigger component maintains proper ARIA attributes and keyboard navigation support.

## Benefits

- **Complete Customization**: Design your trigger exactly as you want it
- **Consistent Behavior**: All dropdown functionality (keyboard navigation, accessibility, etc.) is preserved
- **Flexible Content**: Use any HTML content, icons, images, or components
- **State Awareness**: Your custom trigger can react to dropdown state changes
- **Easy Integration**: Works seamlessly with existing dropdown features

## Styling

The trigger component includes basic styling that you can override with CSS:

```scss
.nxt-dropdown-trigger-content {
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

  .nxt-dropdown-arrow {
    display: flex;
    align-items: center;
    margin-left: 8px;
    transition: transform 0.2s ease;

    svg {
      width: 12px;
      height: 12px;
    }
  }

  &.open .nxt-dropdown-arrow {
    transform: rotate(180deg);
  }
}
```

## Migration from Default Trigger

If you're currently using the default trigger and want to switch to a custom trigger, simply wrap your desired content with `nxt-dropdown-trigger`:

**Before:**
```html
<nxt-dropdown [(ngModel)]="selectedValue" [options]="options">
  <!-- Default trigger is used automatically -->
</nxt-dropdown>
```

**After:**
```html
<nxt-dropdown [(ngModel)]="selectedValue" [options]="options">
  <nxt-dropdown-trigger>
    <!-- Your custom trigger content -->
    <div>Custom Trigger Content</div>
  </nxt-dropdown-trigger>
</nxt-dropdown>
```

The dropdown will automatically detect the presence of a custom trigger and use it instead of the default one. 
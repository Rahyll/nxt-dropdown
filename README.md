# NXT Dropdown

A modern, feature-rich Angular dropdown component built with Angular 15+ that provides comprehensive dropdown/select functionality with advanced features like content projection, custom triggers, and form integration.

## 🚀 Features

- ✅ **Control Value Accessor** - Seamless Angular forms integration
- ✅ **Single & Multiple Selection** - Flexible selection modes
- ✅ **Content Projection** - Declarative option definition like Angular Material
- ✅ **Custom Triggers** - Complete trigger customization
- ✅ **Search Functionality** - Built-in filtering with configurable minimum length
- ✅ **Confirmation Mode** - Apply/Cancel workflow for multiple selections
- ✅ **Form Integration** - Works with Template-driven and Reactive forms
- ✅ **Accessibility** - WCAG 2.1 compliant with ARIA attributes
- ✅ **Responsive Design** - Mobile-friendly with touch optimization
- ✅ **Material Design** - Consistent with Angular Material styling
- ✅ **TypeScript Support** - Full type safety and IntelliSense

## 📦 Installation

The component is included in your Angular project. Ensure you have the required dependencies:

```json
{
  "@angular/material": "^15.0.2",
  "@angular/forms": "^15.0.3"
}
```

## 🎯 Quick Start

### Basic Usage
```html
<nxt-dropdown
  [(ngModel)]="selectedValue"
  [options]="options"
  placeholder="Select an option">
</nxt-dropdown>
```

### Content Projection (Recommended)
```html
<nxt-dropdown [(ngModel)]="selectedValue" placeholder="Select an option">
  <nxt-option value="option1">Option 1</nxt-option>
  <nxt-option value="option2">Option 2</nxt-option>
  <nxt-option value="option3" [disabled]="true">Option 3 (Disabled)</nxt-option>
</nxt-dropdown>
```

### Multiple Selection with Confirmation
```html
<nxt-dropdown
  [(ngModel)]="selectedValues"
  [multiple]="true"
  [confirmation]="true"
  placeholder="Select multiple options">
  <nxt-option value="item1">Item 1</nxt-option>
  <nxt-option value="item2">Item 2</nxt-option>
  <nxt-option value="item3">Item 3</nxt-option>
</nxt-dropdown>
```

## 📚 Documentation

For detailed documentation, examples, and advanced usage, see:
- **[Component Documentation](src/app/nxt-dropdown/README.md)** - Complete API reference and examples

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Run tests
npm test

# Build for production
ng build
```

## 🌟 Key Features

### Content Projection
Define options declaratively in your template for better IDE support and type checking.

### Custom Triggers
Create completely custom trigger designs while maintaining all dropdown functionality.

### Form Integration
Works seamlessly with Angular's form system including validation and error states.

### Accessibility
Built with accessibility in mind, supporting keyboard navigation and screen readers.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
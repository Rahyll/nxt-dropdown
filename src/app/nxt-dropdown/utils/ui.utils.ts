/**
 * UI Utilities
 * 
 * This module contains utility functions for UI-related operations
 * in the dropdown component. It handles icon sanitization, keyboard
 * navigation, and performance optimization functions.
 */
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NxtDropdownOption } from '../interfaces';

/**
 * Sanitizes and returns the icon HTML for safe rendering
 * 
 * This function safely renders icons that can be either string-based
 * (emoji, unicode) or HTML-based (font icons). It uses Angular's
 * DomSanitizer to prevent XSS attacks when rendering HTML icons.
 * 
 * @param icon - Icon string or HTML content to sanitize
 * @param sanitizer - Angular DomSanitizer instance for safe HTML rendering
 * @returns Sanitized HTML that can be safely rendered in templates
 */
export function getSanitizedIcon(icon: string, sanitizer: DomSanitizer): SafeHtml {
  if (!icon) {
    return '';
  }
  
  // Check if the icon contains HTML tags (font icon)
  if (icon.includes('<') && icon.includes('>')) {
    return sanitizer.bypassSecurityTrustHtml(icon);
  }
  
  // For regular string icons (emoji, unicode), return as is
  return icon;
}

/**
 * Track function for ngFor optimization
 * 
 * This function provides a tracking value for Angular's ngFor directive
 * to optimize rendering performance. It uses the option's value as the
 * unique identifier for change detection.
 * 
 * @param index - Index of the item in the array
 * @param option - Option object containing the value to track
 * @returns The option's value to use for change detection
 */
export function trackByValue(index: number, option: NxtDropdownOption): any {
  return option.value;
}

/**
 * Handles keyboard navigation for dropdown
 * 
 * This function processes keyboard events for the dropdown trigger element.
 * It supports standard keyboard navigation patterns including Enter, Space,
 * Escape, and arrow keys for opening/closing the dropdown.
 * 
 * @param event - Keyboard event object from the trigger element
 * @param isDisabled - Whether the dropdown is currently disabled
 * @param isOpen - Whether the dropdown is currently open
 * @param handlers - Object containing handler functions for dropdown actions
 */
export function handleDropdownKeyDown(
  event: KeyboardEvent,
  isDisabled: boolean,
  isOpen: boolean,
  handlers: {
    toggleDropdown: () => void;
    closeDropdown: () => void;
  }
): void {
  if (isDisabled) return;

  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      handlers.toggleDropdown();
      break;
    case 'Escape':
      handlers.closeDropdown();
      break;
    case 'ArrowDown':
      event.preventDefault();
      if (!isOpen) {
        handlers.toggleDropdown();
      }
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (isOpen) {
        handlers.closeDropdown();
      }
      break;
  }
}

/**
 * Handles search input keyboard events
 * 
 * This function processes keyboard events specifically for the search input
 * within the dropdown. It handles Escape to close the dropdown and Enter
 * to select the first available option.
 * 
 * @param event - Keyboard event object from the search input
 * @param handlers - Object containing handler functions for search actions
 */
export function handleSearchKeyDown(
  event: KeyboardEvent,
  handlers: {
    closeDropdown: () => void;
    selectFirstOption: () => void;
  }
): void {
  if (event.key === 'Escape') {
    handlers.closeDropdown();
  } else if (event.key === 'Enter') {
    event.preventDefault();
    handlers.selectFirstOption();
  }
} 
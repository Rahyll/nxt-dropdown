import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NxtDropdownOption } from '../interfaces';

/**
 * Sanitizes and returns the icon HTML for safe rendering
 * Supports both string icons (emoji, unicode) and HTML elements (font icons)
 * @param icon - Icon string or HTML
 * @param sanitizer - Angular DomSanitizer instance
 * @returns Sanitized HTML
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
 * @param index - Index of the item
 * @param option - Option object
 * @returns Value to track
 */
export function trackByValue(index: number, option: NxtDropdownOption): any {
  return option.value;
}

/**
 * Handles keyboard navigation for dropdown
 * @param event - Keyboard event
 * @param isDisabled - Whether dropdown is disabled
 * @param isOpen - Whether dropdown is open
 * @param handlers - Object containing handler functions
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
 * @param event - Keyboard event
 * @param handlers - Object containing handler functions
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
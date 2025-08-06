import { NxtDropdownOption } from '../interfaces';

/**
 * Gets display text for selected options
 * @param selectedOptions - Array of selected options
 * @param placeholder - Placeholder text to show when no options selected
 * @param multiple - Whether multiple selection is enabled
 * @returns Display text
 */
export function getDisplayText(
  selectedOptions: NxtDropdownOption[],
  placeholder: string,
  multiple: boolean
): string {
  if (selectedOptions.length === 0) {
    return placeholder;
  }

  if (multiple) {
    if (selectedOptions.length === 1) {
      return selectedOptions[0].label;
    }
    return selectedOptions.map(option => option.label).join(', ');
  }

  return selectedOptions[0].label;
}

/**
 * Gets display text for pending options (confirmation mode)
 * @param pendingOptions - Array of pending options
 * @param placeholder - Placeholder text to show when no options selected
 * @param multiple - Whether multiple selection is enabled
 * @returns Display text
 */
export function getPendingDisplayText(
  pendingOptions: NxtDropdownOption[],
  placeholder: string,
  multiple: boolean
): string {
  if (pendingOptions.length === 0) {
    return placeholder;
  }

  if (multiple) {
    if (pendingOptions.length === 1) {
      return pendingOptions[0].label;
    }
    return pendingOptions.map(option => option.label).join(', ');
  }

  return pendingOptions[0].label;
}

/**
 * Formats option count for display
 * @param count - Number of selected options
 * @param total - Total number of options
 * @returns Formatted string
 */
export function formatOptionCount(count: number, total: number): string {
  if (count === 0) {
    return 'None selected';
  }
  if (count === total) {
    return 'All selected';
  }
  return `${count} of ${total} selected`;
} 
/**
 * Display Utilities
 * 
 * This module contains utility functions for formatting and displaying
 * dropdown options and selections. It handles text formatting for both
 * single and multiple selection modes.
 */
import { NxtDropdownOption } from '../interfaces';

/**
 * Gets display text for selected options
 * 
 * This function formats the display text for the dropdown trigger based on
 * the currently selected options. It handles both single and multiple
 * selection modes with appropriate formatting.
 * 
 * @param selectedOptions - Array of currently selected options
 * @param placeholder - Placeholder text to show when no options are selected
 * @param multiple - Whether multiple selection mode is enabled
 * @returns Formatted display text for the dropdown trigger
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
 * 
 * This function formats the display text for pending selections in confirmation mode.
 * It works similarly to getDisplayText but uses pending options instead of
 * confirmed selections.
 * 
 * @param pendingOptions - Array of pending options (not yet confirmed)
 * @param placeholder - Placeholder text to show when no options are selected
 * @param multiple - Whether multiple selection mode is enabled
 * @returns Formatted display text for pending selections
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
 * 
 * This function creates a human-readable string showing the count of
 * selected options relative to the total number of options.
 * 
 * @param count - Number of currently selected options
 * @param total - Total number of available options
 * @returns Formatted string showing selection count (e.g., "3 of 10 selected")
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
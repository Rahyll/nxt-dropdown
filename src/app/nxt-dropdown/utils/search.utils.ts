/**
 * Search Utilities
 * 
 * This module contains utility functions for handling search functionality
 * in the dropdown component. It provides filtering, validation, and state
 * management for search operations.
 */
import { NxtDropdownOption } from '../interfaces';

/**
 * Filters options based on search text with case-insensitive matching
 * 
 * This function filters the options array based on the provided search text.
 * It performs case-insensitive matching against the option labels.
 * 
 * @param options - Array of dropdown options to filter
 * @param searchText - Text to search for in option labels
 * @param searchable - Whether search functionality is enabled
 * @param minSearchLength - Minimum length required for search to be applied (default: 0)
 * @returns Filtered array of options that match the search criteria
 */
export function filterOptionsBySearch(
  options: NxtDropdownOption[],
  searchText: string,
  searchable: boolean,
  minSearchLength: number = 0
): NxtDropdownOption[] {
  if (!searchable || !searchText || searchText.length < minSearchLength) {
    return [...options];
  }

  const searchLower = searchText.toLowerCase();
  return options.filter(option => 
    option.label.toLowerCase().includes(searchLower)
  );
}

/**
 * Checks if search functionality should be applied based on searchable flag and search text
 * 
 * This function determines whether search filtering should be applied based on
 * the searchable flag, search text presence, and minimum length requirements.
 * 
 * @param searchable - Whether search functionality is enabled
 * @param searchText - Current search text entered by the user
 * @param minSearchLength - Minimum search length required for filtering (default: 0)
 * @returns True if search filtering should be applied, false otherwise
 */
export function shouldApplySearch(
  searchable: boolean,
  searchText: string,
  minSearchLength: number = 0
): boolean {
  return searchable && !!searchText && searchText.length >= minSearchLength;
}

/**
 * Gets available (non-disabled) options from a filtered list
 * 
 * This function filters out disabled options from the provided options array.
 * It's useful for operations that should only work with selectable options.
 * 
 * @param options - Array of options to filter for availability
 * @returns Array of available (non-disabled) options
 */
export function getAvailableOptions(options: NxtDropdownOption[]): NxtDropdownOption[] {
  return options.filter(option => !option.disabled);
}

/**
 * Finds the first available option in a list
 * 
 * This function searches through the options array and returns the first
 * option that is not disabled. Useful for keyboard navigation and
 * default selections.
 * 
 * @param options - Array of options to search through
 * @returns First available option or undefined if no available options found
 */
export function findFirstAvailableOption(options: NxtDropdownOption[]): NxtDropdownOption | undefined {
  return options.find(option => !option.disabled);
}

/**
 * Clears search state
 * 
 * This function returns an object with cleared search state values.
 * It resets the search text to empty string and hides the search input.
 * 
 * @returns Object containing cleared search state (searchText: '', showSearchInput: false)
 */
export function clearSearchState(): { searchText: string; showSearchInput: boolean } {
  return {
    searchText: '',
    showSearchInput: false
  };
} 
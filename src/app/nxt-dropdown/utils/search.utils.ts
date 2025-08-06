import { NxtDropdownOption } from '../interfaces';

/**
 * Filters options based on search text with case-insensitive matching
 * @param options - Array of dropdown options to filter
 * @param searchText - Text to search for
 * @param searchable - Whether search is enabled
 * @param minSearchLength - Minimum length required for search to be applied
 * @returns Filtered array of options
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
 * @param searchable - Whether search is enabled
 * @param searchText - Current search text
 * @param minSearchLength - Minimum search length required
 * @returns True if search should be applied
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
 * @param options - Array of options to filter
 * @returns Array of available options
 */
export function getAvailableOptions(options: NxtDropdownOption[]): NxtDropdownOption[] {
  return options.filter(option => !option.disabled);
}

/**
 * Finds the first available option in a list
 * @param options - Array of options to search
 * @returns First available option or undefined
 */
export function findFirstAvailableOption(options: NxtDropdownOption[]): NxtDropdownOption | undefined {
  return options.find(option => !option.disabled);
}

/**
 * Clears search state
 * @returns Object with cleared search state
 */
export function clearSearchState(): { searchText: string; showSearchInput: boolean } {
  return {
    searchText: '',
    showSearchInput: false
  };
} 
import { NxtDropdownOption } from '../interfaces';

/**
 * Checks if all available options are selected
 * @param options - Array of options to check
 * @param selectedOptions - Array of currently selected options
 * @param multiple - Whether multiple selection is enabled
 * @returns True if all options are selected
 */
export function isAllSelected(
  options: NxtDropdownOption[],
  selectedOptions: NxtDropdownOption[],
  multiple: boolean
): boolean {
  if (!multiple) return false;
  
  const availableOptions = options.filter(option => !option.disabled);
  
  return availableOptions.length > 0 && 
         availableOptions.every(option => 
           selectedOptions.some(selected => selected.value === option.value)
         );
}

/**
 * Checks if some (but not all) options are selected
 * @param options - Array of options to check
 * @param selectedOptions - Array of currently selected options
 * @param multiple - Whether multiple selection is enabled
 * @returns True if some options are selected
 */
export function isPartiallySelected(
  options: NxtDropdownOption[],
  selectedOptions: NxtDropdownOption[],
  multiple: boolean
): boolean {
  if (!multiple) return false;
  
  const availableOptions = options.filter(option => !option.disabled);
  const selectedCount = availableOptions.filter(option => 
    selectedOptions.some(selected => selected.value === option.value)
  ).length;
  
  return selectedCount > 0 && selectedCount < availableOptions.length;
}

/**
 * Checks if a specific option is selected
 * @param option - Option to check
 * @param selectedOptions - Array of currently selected options
 * @returns True if the option is selected
 */
export function isOptionSelected(
  option: NxtDropdownOption,
  selectedOptions: NxtDropdownOption[]
): boolean {
  return selectedOptions.some(selected => selected.value === option.value);
}

/**
 * Updates selected options based on current value
 * @param value - Current selected value(s)
 * @param options - Available options
 * @param multiple - Whether multiple selection is enabled
 * @returns Array of selected options
 */
export function updateSelectedOptions(
  value: any,
  options: NxtDropdownOption[],
  multiple: boolean
): NxtDropdownOption[] {
  if (!value) {
    return [];
  }

  if (multiple && Array.isArray(value)) {
    return options.filter(option => value.includes(option.value));
  } else {
    return options.filter(option => option.value === value);
  }
}

/**
 * Toggles selection of an option in a list
 * @param option - Option to toggle
 * @param selectedOptions - Current selected options
 * @returns New array of selected options
 */
export function toggleOptionSelection(
  option: NxtDropdownOption,
  selectedOptions: NxtDropdownOption[]
): NxtDropdownOption[] {
  const index = selectedOptions.findIndex(opt => opt.value === option.value);
  
  if (index > -1) {
    return selectedOptions.filter((_, i) => i !== index);
  } else {
    return [...selectedOptions, option];
  }
}

/**
 * Gets values from selected options
 * @param selectedOptions - Array of selected options
 * @param multiple - Whether multiple selection is enabled
 * @returns Value or array of values
 */
export function getValuesFromSelectedOptions(
  selectedOptions: NxtDropdownOption[],
  multiple: boolean
): any {
  if (multiple) {
    return selectedOptions.map(opt => opt.value);
  } else {
    return selectedOptions.length > 0 ? selectedOptions[0].value : null;
  }
} 
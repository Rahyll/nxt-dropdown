import { NxtDropdownConfig } from '../interfaces';

/**
 * Validates strict configuration mode
 * @param config - Configuration object
 * @param directInputs - Object containing direct input values
 * @param strictMode - Whether strict mode is enabled
 * @returns Validation result with error message if invalid
 */
export function validateStrictConfiguration(
  config: NxtDropdownConfig,
  directInputs: any,
  strictMode: boolean
): { isValid: boolean; errorMessage?: string } {
  if (!strictMode) {
    return { isValid: true };
  }

  const hasDirectInputs = hasDirectInputValues(directInputs);
  const hasConfigObject = hasConfigValues(config);

  if (hasDirectInputs && hasConfigObject) {
    return {
      isValid: false,
      errorMessage: 'Cannot mix direct input properties with config object when strictConfigMode is enabled.'
    };
  }

  return { isValid: true };
}

/**
 * Checks if direct inputs are being used
 * @param directInputs - Object containing direct input values
 * @returns True if direct inputs are being used
 */
export function hasDirectInputValues(directInputs: any): boolean {
  return !!(
    directInputs.options?.length > 0 ||
    directInputs.placeholder !== 'Select an option' ||
    directInputs.disabled === true ||
    directInputs.required === true ||
    directInputs.multiple === true ||
    directInputs.confirmation === true ||
    directInputs.panelClass !== '' ||
    directInputs.searchable === true ||
    directInputs.searchPlaceholder !== 'Search options...' ||
    directInputs.minSearchLength !== 0 ||
    directInputs.iconType !== 'caret' ||
    directInputs.infieldLabel === true ||
    directInputs.infieldLabelText !== '' ||
    directInputs.infieldLabelPosition !== 'infield' ||
    directInputs.floatlabel === true ||
    directInputs.floatlabelText !== '' ||
    directInputs.floatlabelPosition !== 'infield'
  );
}

/**
 * Checks if config object has values
 * @param config - Configuration object
 * @returns True if config object has values
 */
export function hasConfigValues(config: NxtDropdownConfig): boolean {
  if (!config || Object.keys(config).length === 0) {
    return false;
  }
  
  return !!(
    config.options ||
    config.placeholder ||
    config.disabled !== undefined ||
    config.required !== undefined ||
    config.multiple !== undefined ||
    config.confirmation !== undefined ||
    config.panelClass ||
    config.searchable !== undefined ||
    config.searchPlaceholder ||
    config.minSearchLength !== undefined ||
    config.iconType !== undefined ||
    config.infieldLabel !== undefined ||
    config.infieldLabelText ||
    config.infieldLabelPosition !== undefined ||
    config.floatlabel !== undefined ||
    config.floatlabelText ||
    config.floatlabelPosition !== undefined
  );
}

/**
 * Merges configuration with direct inputs based on strict mode
 * @param config - Configuration object
 * @param directInputs - Direct input values
 * @param strictMode - Whether strict mode is enabled
 * @returns Merged configuration
 */
export function mergeConfiguration(
  config: NxtDropdownConfig,
  directInputs: any,
  strictMode: boolean
): any {
  if (strictMode) {
    // In strict mode, prioritize config object over direct inputs
    return {
      options: config.options || directInputs.options || [],
      placeholder: config.placeholder || directInputs.placeholder || 'Select an option',
      disabled: config.disabled !== undefined ? config.disabled : (directInputs.disabled || false),
      required: config.required !== undefined ? config.required : (directInputs.required || false),
      multiple: config.multiple !== undefined ? config.multiple : (directInputs.multiple || false),
      confirmation: config.confirmation !== undefined ? config.confirmation : (directInputs.confirmation || false),
      panelClass: config.panelClass || directInputs.panelClass || '',
      searchable: config.searchable !== undefined ? config.searchable : (directInputs.searchable || false),
      searchPlaceholder: config.searchPlaceholder || directInputs.searchPlaceholder || 'Search options...',
      minSearchLength: config.minSearchLength !== undefined ? config.minSearchLength : (directInputs.minSearchLength || 0),
      iconType: config.iconType || directInputs.iconType || 'caret',
      infieldLabel: config.infieldLabel !== undefined ? config.infieldLabel : (directInputs.infieldLabel || false),
      infieldLabelText: config.infieldLabelText || directInputs.infieldLabelText || '',
      infieldLabelPosition: config.infieldLabelPosition || directInputs.infieldLabelPosition || 'infield',
      floatlabel: config.floatlabel !== undefined ? config.floatlabel : (directInputs.floatlabel || false),
      floatlabelText: config.floatlabelText || directInputs.floatlabelText || '',
      floatlabelPosition: config.floatlabelPosition || directInputs.floatlabelPosition || 'infield'
    };
  } else {
    // In non-strict mode, direct inputs override config object
    return {
      options: directInputs.options || config.options || [],
      placeholder: directInputs.placeholder !== 'Select an option' ? directInputs.placeholder : (config.placeholder || 'Select an option'),
      disabled: directInputs.disabled !== undefined ? directInputs.disabled : (config.disabled || false),
      required: directInputs.required !== undefined ? directInputs.required : (config.required || false),
      multiple: directInputs.multiple !== undefined ? directInputs.multiple : (config.multiple || false),
      confirmation: directInputs.confirmation !== undefined ? directInputs.confirmation : (config.confirmation || false),
      panelClass: directInputs.panelClass !== '' ? directInputs.panelClass : (config.panelClass || ''),
      searchable: directInputs.searchable !== undefined ? directInputs.searchable : (config.searchable || false),
      searchPlaceholder: directInputs.searchPlaceholder !== 'Search options...' ? directInputs.searchPlaceholder : (config.searchPlaceholder || 'Search options...'),
      minSearchLength: directInputs.minSearchLength !== undefined ? directInputs.minSearchLength : (config.minSearchLength || 0),
      iconType: directInputs.iconType !== 'caret' ? directInputs.iconType : (config.iconType || 'caret'),
      infieldLabel: directInputs.infieldLabel !== undefined ? directInputs.infieldLabel : (config.infieldLabel || false),
      infieldLabelText: directInputs.infieldLabelText !== '' ? directInputs.infieldLabelText : (config.infieldLabelText || ''),
      infieldLabelPosition: directInputs.infieldLabelPosition !== 'infield' ? directInputs.infieldLabelPosition : (config.infieldLabelPosition || 'infield'),
      floatlabel: directInputs.floatlabel !== undefined ? directInputs.floatlabel : (config.floatlabel || false),
      floatlabelText: directInputs.floatlabelText !== '' ? directInputs.floatlabelText : (config.floatlabelText || ''),
      floatlabelPosition: directInputs.floatlabelPosition !== 'infield' ? directInputs.floatlabelPosition : (config.floatlabelPosition || 'infield')
    };
  }
} 
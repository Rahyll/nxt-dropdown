import { NxtDropdownConfig, NxtDropdownBasicConfig, NxtDropdownSelectionConfig, NxtDropdownSearchConfig, NxtDropdownLabelConfig, NxtDropdownIconConfig, NxtDropdownConfirmationConfig } from '../interfaces';

/**
 * Simplified validation for strict configuration mode
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

  const hasDirectInputs = hasValues(directInputs);
  const hasConfigObject = hasValues(config);

  if (hasDirectInputs && hasConfigObject) {
    return {
      isValid: false,
      errorMessage: 'Cannot mix direct input properties with config object when strictConfigMode is enabled.'
    };
  }

  return { isValid: true };
}

/**
 * Simplified function to check if an object has meaningful values
 * @param obj - Object to check
 * @returns True if object has values
 */
export function hasValues(obj: any): boolean {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  return Object.keys(obj).length > 0 && 
         Object.values(obj).some(val => 
           val !== undefined && 
           val !== null && 
           val !== '' && 
           (Array.isArray(val) ? val.length > 0 : true)
         );
}

/**
 * Optimized configuration merger with cleaner logic
 * @param config - Configuration object
 * @param directInputs - Direct input values
 * @param strictMode - Whether strict mode is enabled
 * @returns Merged configuration
 */
export function mergeConfiguration(
  config: NxtDropdownConfig,
  directInputs: any,
  strictMode: boolean
): NxtDropdownConfig {
  const merged = { ...config };
  
  if (!strictMode) {
    // In non-strict mode, direct inputs override config object
    Object.assign(merged, directInputs);
  }
  
  return merged;
}

/**
 * Merge grouped configurations into a single config object
 * @param basic - Basic configuration
 * @param selection - Selection configuration
 * @param search - Search configuration
 * @param label - Label configuration
 * @param icon - Icon configuration
 * @param confirmation - Confirmation configuration
 * @returns Merged configuration object
 */
export function mergeGroupedConfigurations(
  basic: NxtDropdownBasicConfig = {},
  selection: NxtDropdownSelectionConfig = {},
  search: NxtDropdownSearchConfig = {},
  label: NxtDropdownLabelConfig = {},
  icon: NxtDropdownIconConfig = {},
  confirmation: NxtDropdownConfirmationConfig = {}
): NxtDropdownConfig {
  return {
    ...basic,
    ...selection,
    ...search,
    ...label,
    ...icon,
    confirmationButtons: {
      apply: {
        text: confirmation.applyButtonText,
        icon: confirmation.applyButtonIcon
      },
      cancel: {
        text: confirmation.cancelButtonText,
        icon: confirmation.cancelButtonIcon
      }
    }
  };
}

/**
 * Extract grouped configurations from a single config object
 * @param config - Configuration object
 * @returns Object containing grouped configurations
 */
export function extractGroupedConfigurations(config: NxtDropdownConfig): {
  basic: NxtDropdownBasicConfig;
  selection: NxtDropdownSelectionConfig;
  search: NxtDropdownSearchConfig;
  label: NxtDropdownLabelConfig;
  icon: NxtDropdownIconConfig;
  confirmation: NxtDropdownConfirmationConfig;
} {
  return {
    basic: {
      options: config.options,
      placeholder: config.placeholder,
      disabled: config.disabled,
      required: config.required,
      panelClass: config.panelClass
    },
    selection: {
      multiple: config.multiple,
      confirmation: config.confirmation
    },
    search: {
      searchable: config.searchable,
      searchPlaceholder: config.searchPlaceholder,
      minSearchLength: config.minSearchLength
    },
    label: {
      infieldLabel: config.infieldLabel,
      infieldLabelText: config.infieldLabelText,
      infieldLabelPosition: config.infieldLabelPosition,
      floatlabel: config.floatlabel,
      floatlabelText: config.floatlabelText,
      floatlabelPosition: config.floatlabelPosition
    },
    icon: {
      iconType: config.iconType
    },
    confirmation: {
      applyButtonText: config.confirmationButtons?.apply?.text,
      applyButtonIcon: config.confirmationButtons?.apply?.icon,
      cancelButtonText: config.confirmationButtons?.cancel?.text,
      cancelButtonIcon: config.confirmationButtons?.cancel?.icon
    }
  };
}

/**
 * Validate configuration object for required properties
 * @param config - Configuration object to validate
 * @returns Validation result
 */
export function validateConfiguration(config: NxtDropdownConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (config.multiple && config.confirmation && !config.confirmationButtons) {
    errors.push('Confirmation buttons configuration is required when multiple and confirmation are enabled');
  }
  
  if (config.searchable && config.minSearchLength && config.minSearchLength < 0) {
    errors.push('minSearchLength must be a non-negative number');
  }
  
  if (config.infieldLabel && config.floatlabel) {
    errors.push('Cannot use both infieldLabel and floatlabel simultaneously');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
} 
export interface NxtDropdownOption {
  value: any;
  label: string;
  disabled?: boolean;
  group?: string;
}

// New grouped interfaces for better organization
export interface NxtDropdownBasicConfig {
  options?: NxtDropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  panelClass?: string;
}

export interface NxtDropdownSelectionConfig {
  multiple?: boolean;
  confirmation?: boolean;
}

export interface NxtDropdownSearchConfig {
  searchable?: boolean;
  searchPlaceholder?: string;
  minSearchLength?: number;
}

export interface NxtDropdownLabelConfig {
  infieldLabel?: boolean;
  infieldLabelText?: string;
  infieldLabelPosition?: 'infield' | 'onfield';
  floatlabel?: boolean;
  floatlabelText?: string;
  floatlabelPosition?: 'infield' | 'onfield';
}

export interface NxtDropdownIconConfig {
  iconType?: 'caret' | 'arrow' | 'sharp-caret' | 'inverted-triangle';
}

export interface NxtDropdownConfirmationConfig {
  applyButtonText?: string;
  applyButtonIcon?: string;
  cancelButtonText?: string;
  cancelButtonIcon?: string;
}

// Consolidated state interface
export interface NxtDropdownState {
  value: any;
  isDisabled: boolean;
  isOpen: boolean;
  selectedOptions: NxtDropdownOption[];
  pendingOptions: NxtDropdownOption[];
  searchText: string;
  filteredOptions: NxtDropdownOption[];
  showSearchInput: boolean;
  shouldPositionAbove: boolean;
  pendingValue: any;
}

export interface NxtDropdownConfig {
  options?: NxtDropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  confirmation?: boolean;
  panelClass?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  minSearchLength?: number;
  showDescriptions?: boolean;
  showGroups?: boolean;
  iconType?: 'caret' | 'arrow' | 'sharp-caret' | 'inverted-triangle';
  confirmationButtons?: {
    apply?: {
      text?: string;
      icon?: string;
    };
    cancel?: {
      text?: string;
      icon?: string;
    };
  };
  // Add infield label configuration
  infieldLabel?: boolean;
  infieldLabelText?: string;
  infieldLabelPosition?: 'infield' | 'onfield';
  // Add floating label configuration
  floatlabel?: boolean;
  floatlabelText?: string;
  floatlabelPosition?: 'infield' | 'onfield';
} 
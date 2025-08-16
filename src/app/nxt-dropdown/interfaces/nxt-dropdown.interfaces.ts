export interface NxtDropdownOption {
  value: any;
  label: string;
  disabled?: boolean;
  group?: string;
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
  infieldLabelPosition?: 'infield' | 'above';
} 
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NxtDropdownComponent } from './nxt-dropdown.component';
import { NxtDropdownOption, NxtDropdownConfig } from './interfaces/nxt-dropdown.interfaces';
import { NxtOptionComponent } from './components/nxt-option/nxt-option.component';
import { QueryList } from '@angular/core';

describe('NxtDropdownComponent', () => {
  let component: NxtDropdownComponent;
  let fixture: ComponentFixture<NxtDropdownComponent>;

  const mockOptions: NxtDropdownOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
    { value: 'option4', label: 'Option 4' },
    { value: 'option5', label: 'Option 5' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NxtDropdownComponent],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NxtDropdownComponent);
    component = fixture.componentInstance;
    component.options = mockOptions;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.value).toBeNull();
      expect(component.selectedOptions).toEqual([]);
      expect(component.pendingOptions).toEqual([]);
      expect(component.isOpen).toBeFalse();
      expect(component.multiple).toBeFalse();
      expect(component.confirmation).toBeFalse();
      expect(component.required).toBeFalse();
      expect(component.disabled).toBeFalse();
      expect(component.placeholder).toBe('Select an option');
    });

    it('should set initial value correctly', () => {
      component.value = 'option1';
      fixture.detectChanges();
      expect(component.selectedOptions).toEqual([mockOptions[0]]);
    });

    it('should set initial multiple values correctly', () => {
      component.multiple = true;
      component.value = ['option1', 'option2'];
      fixture.detectChanges();
      expect(component.selectedOptions).toEqual([mockOptions[0], mockOptions[1]]);
    });
  });

  describe('Configuration Object Support', () => {
    it('should work with configuration object', () => {
      const config: NxtDropdownConfig = {
        options: mockOptions,
        placeholder: 'Custom placeholder',
        multiple: true,
        searchable: true
      };
      
      component.config = config;
      component.ngOnInit();
      
      expect(component.options).toEqual(mockOptions);
      expect(component.placeholder).toBe('Custom placeholder');
      expect(component.multiple).toBeTrue();
      expect(component.searchable).toBeTrue();
    });

    it('should prioritize direct inputs over config when not in strict mode', () => {
      const config: NxtDropdownConfig = {
        placeholder: 'Config placeholder',
        multiple: true
      };
      
      component.config = config;
      component.placeholder = 'Direct placeholder';
      component.multiple = false;
      component.ngOnInit();
      
      expect(component.placeholder).toBe('Direct placeholder');
      expect(component.multiple).toBeFalse();
    });

    it('should use only config when in strict mode', () => {
      const config: NxtDropdownConfig = {
        placeholder: 'Config placeholder',
        multiple: true
      };
      
      component.config = config;
      component.strictConfigMode = true;
      component.placeholder = 'Direct placeholder';
      component.multiple = false;
      component.ngOnInit();
      
      expect(component.placeholder).toBe('Config placeholder');
      expect(component.multiple).toBeTrue();
    });

    it('should throw error when strict mode is enabled but no config provided', () => {
      component.strictConfigMode = true;
      component.config = {};
      
      expect(() => component.ngOnInit()).toThrowError('Strict configuration mode requires a valid config object');
    });

    it('should validate configuration object', () => {
      const invalidConfig = {
        options: 'invalid' // should be array
      } as any;
      
      component.config = invalidConfig;
      component.strictConfigMode = true;
      
      expect(() => component.ngOnInit()).toThrowError('Invalid configuration: options must be an array');
    });
  });

  describe('Single Selection', () => {
    it('should select a single option', () => {
      const option = mockOptions[0];
      component.selectOption(option);
      
      expect(component.selectedOptions).toEqual([option]);
      expect(component.value).toBe(option.value);
      expect(component.isOpen).toBeFalse();
    });

    it('should not select disabled options', () => {
      const disabledOption = mockOptions[2]; // option3 is disabled
      component.selectOption(disabledOption);
      
      expect(component.selectedOptions).toEqual([]);
      expect(component.value).toBeNull();
    });

    it('should deselect when selecting the same option again', () => {
      const option = mockOptions[0];
      component.selectOption(option);
      component.selectOption(option);
      
      expect(component.selectedOptions).toEqual([]);
      expect(component.value).toBeNull();
    });

    it('should emit selectionChange event', () => {
      spyOn(component.selectionChange, 'emit');
      const option = mockOptions[0];
      
      component.selectOption(option);
      
      expect(component.selectionChange.emit).toHaveBeenCalledWith(option.value);
    });
  });

  describe('Multiple Selection', () => {
    beforeEach(() => {
      component.multiple = true;
      fixture.detectChanges();
    });

    it('should select multiple options', () => {
      const option1 = mockOptions[0];
      const option2 = mockOptions[1];
      
      component.selectOption(option1);
      component.selectOption(option2);
      
      expect(component.selectedOptions).toEqual([option1, option2]);
      expect(component.value).toEqual([option1.value, option2.value]);
    });

    it('should remove option when selecting it again', () => {
      const option1 = mockOptions[0];
      const option2 = mockOptions[1];
      
      component.selectOption(option1);
      component.selectOption(option2);
      component.selectOption(option1); // Remove option1
      
      expect(component.selectedOptions).toEqual([option2]);
      expect(component.value).toEqual([option2.value]);
    });

    it('should emit selectionChange event for multiple selection', () => {
      spyOn(component.selectionChange, 'emit');
      const option1 = mockOptions[0];
      const option2 = mockOptions[1];
      
      component.selectOption(option1);
      component.selectOption(option2);
      
      expect(component.selectionChange.emit).toHaveBeenCalledWith([option1.value, option2.value]);
    });
  });

  describe('Select All Functionality', () => {
    beforeEach(() => {
      component.multiple = true;
      fixture.detectChanges();
    });

    it('should select all enabled options', () => {
      component.selectAll();
      
      const enabledOptions = mockOptions.filter(opt => !opt.disabled);
      expect(component.selectedOptions).toEqual(enabledOptions);
      expect(component.value).toEqual(enabledOptions.map(opt => opt.value));
    });

    it('should deselect all when all are selected', () => {
      // First select all
      component.selectAll();
      // Then select all again (should deselect all)
      component.selectAll();
      
      expect(component.selectedOptions).toEqual([]);
      expect(component.value).toEqual([]);
    });

    it('should return correct all selected state', () => {
      expect(component.isAllSelected()).toBeFalse();
      
      component.selectAll();
      expect(component.isAllSelected()).toBeTrue();
    });

    it('should return correct partially selected state', () => {
      expect(component.isPartiallySelected()).toBeFalse();
      
      component.selectOption(mockOptions[0]);
      expect(component.isPartiallySelected()).toBeTrue();
    });
  });

  describe('Confirmation Mode', () => {
    beforeEach(() => {
      component.multiple = true;
      component.confirmation = true;
      fixture.detectChanges();
    });

    it('should use pending options in confirmation mode', () => {
      const option1 = mockOptions[0];
      const option2 = mockOptions[1];
      
      component.selectOption(option1);
      component.selectOption(option2);
      
      expect(component.pendingOptions).toEqual([option1, option2]);
      expect(component.selectedOptions).toEqual([]);
      expect(component.value).toEqual([]);
    });

    it('should apply pending selections', () => {
      const option1 = mockOptions[0];
      const option2 = mockOptions[1];
      
      component.selectOption(option1);
      component.selectOption(option2);
      component.applySelection();
      
      expect(component.selectedOptions).toEqual([option1, option2]);
      expect(component.pendingOptions).toEqual([]);
      expect(component.value).toEqual([option1.value, option2.value]);
    });

    it('should cancel pending selections', () => {
      const option1 = mockOptions[0];
      const option2 = mockOptions[1];
      
      component.selectOption(option1);
      component.selectOption(option2);
      component.cancelSelection();
      
      expect(component.selectedOptions).toEqual([]);
      expect(component.pendingOptions).toEqual([]);
      expect(component.value).toEqual([]);
    });

    it('should close dropdown after apply/cancel', () => {
      component.toggleDropdown();
      expect(component.isOpen).toBeTrue();
      
      component.applySelection();
      expect(component.isOpen).toBeFalse();
      
      component.toggleDropdown();
      component.cancelSelection();
      expect(component.isOpen).toBeFalse();
    });
  });

  describe('Dropdown Toggle', () => {
    it('should toggle dropdown state', () => {
      expect(component.isOpen).toBeFalse();
      
      component.toggleDropdown();
      expect(component.isOpen).toBeTrue();
      
      component.toggleDropdown();
      expect(component.isOpen).toBeFalse();
    });

    it('should not open dropdown when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      
      component.toggleDropdown();
      expect(component.isOpen).toBeFalse();
    });

    it('should close dropdown when clicking outside', () => {
      component.toggleDropdown();
      expect(component.isOpen).toBeTrue();
      
      // Simulate click outside
      const event = new MouseEvent('click');
      document.dispatchEvent(event);
      
      expect(component.isOpen).toBeFalse();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(component, 'toggleDropdown');
      
      component.onKeyDown(event);
      
      expect(component.toggleDropdown).toHaveBeenCalled();
    });

    it('should handle Space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      spyOn(component, 'toggleDropdown');
      
      component.onKeyDown(event);
      
      expect(component.toggleDropdown).toHaveBeenCalled();
    });

    it('should prevent default for Enter and Space', () => {
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      
      spyOn(enterEvent, 'preventDefault');
      spyOn(spaceEvent, 'preventDefault');
      
      component.onKeyDown(enterEvent);
      component.onKeyDown(spaceEvent);
      
      expect(enterEvent.preventDefault).toHaveBeenCalled();
      expect(spaceEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe('Display Text', () => {
    it('should return correct display text for single selection', () => {
      component.selectOption(mockOptions[0]);
      expect(component.getDisplayText()).toBe('Option 1');
    });

    it('should return correct display text for multiple selection', () => {
      component.multiple = true;
      component.selectOption(mockOptions[0]);
      component.selectOption(mockOptions[1]);
      
      expect(component.getDisplayText()).toBe('Option 1, Option 2');
    });

    it('should return correct display text for multiple selection with more than 2 items', () => {
      component.multiple = true;
      component.selectOption(mockOptions[0]);
      component.selectOption(mockOptions[1]);
      component.selectOption(mockOptions[3]);
      
      expect(component.getDisplayText()).toBe('3 items selected');
    });

    it('should return correct pending display text in confirmation mode', () => {
      component.multiple = true;
      component.confirmation = true;
      component.selectOption(mockOptions[0]);
      component.selectOption(mockOptions[1]);
      
      expect(component.getPendingDisplayText()).toBe('Option 1, Option 2');
    });
  });

  describe('Option Selection State', () => {
    it('should correctly identify selected options', () => {
      component.selectOption(mockOptions[0]);
      
      expect(component.isOptionSelected(mockOptions[0])).toBeTrue();
      expect(component.isOptionSelected(mockOptions[1])).toBeFalse();
    });

    it('should correctly identify selected options in confirmation mode', () => {
      component.multiple = true;
      component.confirmation = true;
      component.selectOption(mockOptions[0]);
      
      expect(component.isOptionSelected(mockOptions[0])).toBeTrue();
    });
  });

  describe('Form Integration', () => {
    it('should work with ngModel', fakeAsync(() => {
      component.writeValue('option1');
      tick();
      
      expect(component.selectedOptions).toEqual([mockOptions[0]]);
    }));

    it('should work with FormControl', () => {
      const formControl = new FormControl('option1');
      component.writeValue('option1');
      
      expect(component.selectedOptions).toEqual([mockOptions[0]]);
    });

    it('should register onChange function', () => {
      const onChange = jasmine.createSpy('onChange');
      component.registerOnChange(onChange);
      
      component.selectOption(mockOptions[0]);
      
      expect(onChange).toHaveBeenCalledWith('option1');
    });

    it('should register onTouched function', () => {
      const onTouched = jasmine.createSpy('onTouched');
      component.registerOnTouched(onTouched);
      
      component.toggleDropdown();
      
      expect(onTouched).toHaveBeenCalled();
    });
  });

  describe('Required Validation', () => {
    it('should show error when required and no value', () => {
      component.required = true;
      component.value = null;
      fixture.detectChanges();
      
      const errorElement = fixture.debugElement.query(By.css('.nxt-dropdown-error'));
      expect(errorElement).toBeTruthy();
      expect(errorElement.nativeElement.textContent).toContain('This field is required');
    });

    it('should not show error when required and has value', () => {
      component.required = true;
      component.value = 'option1';
      fixture.detectChanges();
      
      const errorElement = fixture.debugElement.query(By.css('.nxt-dropdown-error'));
      expect(errorElement).toBeFalsy();
    });
  });

  describe('Disabled State', () => {
    it('should apply disabled styles', () => {
      component.disabled = true;
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('.nxt-dropdown-container'));
      expect(container.nativeElement.classList.contains('disabled')).toBeTrue();
    });

    it('should not respond to clicks when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      
      component.toggleDropdown();
      expect(component.isOpen).toBeFalse();
    });
  });

  describe('Track By Function', () => {
    it('should return value for trackBy', () => {
      const result = component.trackByValue(0, mockOptions[0]);
      expect(result).toBe('option1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      component.options = [];
      fixture.detectChanges();
      
      expect(component.isAllSelected()).toBeFalse();
      expect(component.isPartiallySelected()).toBeFalse();
    });

    it('should handle null/undefined options', () => {
      component.options = null as any;
      fixture.detectChanges();
      
      expect(component.isAllSelected()).toBeFalse();
      expect(component.isPartiallySelected()).toBeFalse();
    });

    it('should handle options with missing properties', () => {
      const invalidOptions = [
        { value: 'test1' }, // missing label
        { label: 'Test 2' }, // missing value
        { value: 'test3', label: 'Test 3' }
      ] as any;
      
      component.options = invalidOptions;
      fixture.detectChanges();
      
      // Should not crash
      expect(component.options).toEqual(invalidOptions);
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      const trigger = fixture.debugElement.query(By.css('.nxt-dropdown-trigger'));
      
      expect(trigger.nativeElement.getAttribute('role')).toBe('combobox');
      expect(trigger.nativeElement.getAttribute('aria-expanded')).toBe('false');
      expect(trigger.nativeElement.getAttribute('aria-haspopup')).toBe('true');
    });

    it('should update ARIA attributes when dropdown opens', () => {
      component.toggleDropdown();
      fixture.detectChanges();
      
      const trigger = fixture.debugElement.query(By.css('.nxt-dropdown-trigger'));
      expect(trigger.nativeElement.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have correct ARIA attributes for options', () => {
      component.toggleDropdown();
      fixture.detectChanges();
      
      const options = fixture.debugElement.queryAll(By.css('.nxt-dropdown-option'));
      expect(options[0].nativeElement.getAttribute('role')).toBe('option');
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      component.searchable = true;
      component.ngOnInit();
    });

    it('should initialize with all options when searchable is true', () => {
      expect(component.filteredOptions).toEqual(mockOptions);
    });

    it('should filter options when search text is entered', () => {
      component.searchText = 'option';
      component.updateFilteredOptions();
      
      expect(component.filteredOptions).toEqual([
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ]);
    });

    it('should filter options case-insensitively', () => {
      component.searchText = 'OPTION';
      component.updateFilteredOptions();
      
      expect(component.filteredOptions).toEqual([
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ]);
    });

    it('should show all options when search text is cleared', () => {
      component.searchText = 'option';
      component.updateFilteredOptions();
      expect(component.filteredOptions.length).toBe(3);
      
      component.searchText = '';
      component.updateFilteredOptions();
      expect(component.filteredOptions).toEqual(mockOptions);
    });

    it('should respect minimum search length', () => {
      component.minSearchLength = 2;
      component.searchText = 'a';
      component.updateFilteredOptions();
      
      // Should show all options when search length is less than minimum
      expect(component.filteredOptions).toEqual(mockOptions);
      
      component.searchText = 'op';
      component.updateFilteredOptions();
      
      // Should filter when search length meets minimum
      expect(component.filteredOptions).toEqual([
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ]);
    });

    it('should clear search when dropdown is closed', () => {
      component.searchText = 'option';
      component.showSearchInput = true;
      
      component.closeDropdown();
      
      expect(component.searchText).toBe('');
      expect(component.showSearchInput).toBe(false);
    });

    it('should focus search input when dropdown opens with searchable enabled', () => {
      const focusSpy = spyOn(component['elementRef'].nativeElement, 'querySelector').and.returnValue({
        focus: jasmine.createSpy('focus')
      });
      
      component.toggleDropdown();
      
      expect(component.showSearchInput).toBe(true);
    });
  });

  describe('Search Input Events', () => {
    beforeEach(() => {
      component.searchable = true;
      component.ngOnInit();
    });

    it('should update search text on input event', () => {
      const mockEvent = { target: { value: 'test search' } } as any;
      
      component.onSearchInput(mockEvent);
      
      expect(component.searchText).toBe('test search');
    });

    it('should close dropdown on escape key', () => {
      const mockEvent = { key: 'Escape' } as KeyboardEvent;
      spyOn(component, 'closeDropdown');
      
      component.onSearchKeyDown(mockEvent);
      
      expect(component.closeDropdown).toHaveBeenCalled();
    });

    it('should select first available option on enter key', () => {
      const mockEvent = { key: 'Enter', preventDefault: jasmine.createSpy('preventDefault') } as any;
      component.searchText = 'option';
      component.updateFilteredOptions();
      spyOn(component, 'selectOption');
      
      component.onSearchKeyDown(mockEvent);
      
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(component.selectOption).toHaveBeenCalledWith(mockOptions[0]);
    });
  });

  describe('Configuration Getters', () => {
    it('should return correct options', () => {
      expect(component.options).toEqual(mockOptions);
    });

    it('should return correct placeholder', () => {
      expect(component.placeholder).toBe('Select an option');
    });

    it('should return correct disabled state', () => {
      expect(component.disabled).toBeFalse();
    });

    it('should return correct required state', () => {
      expect(component.required).toBeFalse();
    });

    it('should return correct multiple state', () => {
      expect(component.multiple).toBeFalse();
    });

    it('should return correct confirmation state', () => {
      expect(component.confirmation).toBeFalse();
    });

    it('should return correct panel class', () => {
      expect(component.panelClass).toBe('');
    });

    it('should return correct searchable state', () => {
      expect(component.searchable).toBeFalse();
    });

    it('should return correct search placeholder', () => {
      expect(component.searchPlaceholder).toBe('Search options...');
    });

    it('should return correct min search length', () => {
      expect(component.minSearchLength).toBe(0);
    });

    it('should return correct icon type', () => {
      expect(component.iconType).toBe('caret');
    });
  });

  describe('Icon Type Feature', () => {
    it('should default to caret icon type', () => {
      expect(component.iconType).toBe('caret');
      expect(component.iconType).toBe('caret');
    });

    it('should set arrow icon type via direct input', () => {
      component.iconType = 'arrow';
      component.ngOnInit();
      
      expect(component.iconType).toBe('arrow');
    });

    it('should set icon type via configuration object', () => {
      const config: NxtDropdownConfig = {
        options: mockOptions,
        iconType: 'arrow'
      };
      
      component.config = config;
      component.ngOnInit();
      
      expect(component.iconType).toBe('arrow');
    });

    it('should prioritize direct input over config when not in strict mode', () => {
      const config: NxtDropdownConfig = {
        iconType: 'arrow'
      };
      
      component.config = config;
      component.iconType = 'caret';
      component.ngOnInit();
      
      expect(component.iconType).toBe('caret');
    });

    it('should use config icon type when in strict mode', () => {
      const config: NxtDropdownConfig = {
        iconType: 'arrow'
      };
      
      component.config = config;
      component.strictConfigMode = true;
      component.ngOnInit();
      
      expect(component.iconType).toBe('arrow');
    });

    it('should update trigger properties with icon type', () => {
      component.iconType = 'arrow';
      component.ngOnInit();
      
      // Mock custom trigger
      component['customTrigger'] = {
        iconType: 'caret',
        disabled: false,
        isOpen: false,
        required: false,
        multiple: false,
        placeholder: '',
        showArrow: true,
        triggerClick: jasmine.createSpyObj('EventEmitter', ['emit']),
        keyDown: jasmine.createSpyObj('EventEmitter', ['emit']),
        onTriggerClick: jasmine.createSpy('onTriggerClick'),
        onKeyDown: jasmine.createSpy('onKeyDown')
      };
      
      component['updateTriggerProperties']();
      
      expect(component['customTrigger'].iconType).toBe('arrow');
    });
  });

  describe('Dropdown Positioning', () => {
    beforeEach(() => {
      // Mock window.innerHeight
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      });
    });

    it('should position dropdown below by default when there is enough space', () => {
      // Mock getBoundingClientRect to simulate trigger at top of viewport
      const mockRect = {
        bottom: 100,
        top: 50,
        left: 0,
        right: 200,
        width: 200,
        height: 50
      };
      
      const mockElement = {
        getBoundingClientRect: () => mockRect
      };
      
      spyOn(component['elementRef'].nativeElement, 'querySelector').and.returnValue(mockElement);
      
      component.toggleDropdown();
      
      expect(component.shouldPositionAbove).toBeFalse();
    });

    it('should position dropdown above when there is not enough space below', () => {
      // Mock getBoundingClientRect to simulate trigger near bottom of viewport
      const mockRect = {
        bottom: 750, // Near bottom of 800px viewport
        top: 700,
        left: 0,
        right: 200,
        width: 200,
        height: 50
      };
      
      const mockElement = {
        getBoundingClientRect: () => mockRect
      };
      
      spyOn(component['elementRef'].nativeElement, 'querySelector').and.returnValue(mockElement);
      
      component.toggleDropdown();
      
      expect(component.shouldPositionAbove).toBeTrue();
    });

    it('should recalculate position on window resize', () => {
      component.isOpen = true;
      spyOn(component as any, 'calculateDropdownPosition');
      
      component.onWindowResize();
      
      expect(component['calculateDropdownPosition']).toHaveBeenCalled();
    });

    it('should recalculate position on window scroll', () => {
      component.isOpen = true;
      spyOn(component as any, 'calculateDropdownPosition');
      
      component.onWindowScroll();
      
      expect(component['calculateDropdownPosition']).toHaveBeenCalled();
    });

    it('should recalculate position when filtered options change', fakeAsync(() => {
      component.isOpen = true;
      component.searchable = true;
      spyOn(component as any, 'calculateDropdownPosition');
      
      component.updateFilteredOptions();
      tick(0); // Wait for setTimeout
      
      expect(component['calculateDropdownPosition']).toHaveBeenCalled();
    }));

    it('should use correct max height for confirmation mode', () => {
      component.confirmation = true;
      component.multiple = true;
      
      // Mock getBoundingClientRect to simulate trigger near bottom of viewport
      const mockRect = {
        bottom: 750,
        top: 700,
        left: 0,
        right: 200,
        width: 200,
        height: 50
      };
      
      const mockElement = {
        getBoundingClientRect: () => mockRect
      };
      
      spyOn(component['elementRef'].nativeElement, 'querySelector').and.returnValue(mockElement);
      
      component.toggleDropdown();
      
      // Should still position above even with larger max height for confirmation mode
      expect(component.shouldPositionAbove).toBeTrue();
    });
  });

  describe('Option Groups', () => {
    it('should process grouped options correctly', () => {
      // Create mock option group components
      const mockGroup1 = {
        label: 'Fruits',
        getOptions: () => [
          { value: 'apple', label: 'Apple', disabled: false, group: 'Fruits' },
          { value: 'banana', label: 'Banana', disabled: false, group: 'Fruits' }
        ]
      };
      
      const mockGroup2 = {
        label: 'Vegetables',
        getOptions: () => [
          { value: 'carrot', label: 'Carrot', disabled: false, group: 'Vegetables' },
          { value: 'broccoli', label: 'Broccoli', disabled: true, group: 'Vegetables' }
        ]
      };

      // Mock the QueryList
      const mockQueryList = {
        forEach: (callback: (item: any) => void) => {
          callback(mockGroup1);
          callback(mockGroup2);
        }
      };

      // Set up the component
      component.optionGroupComponents = mockQueryList as any;
      component.optionComponents = new QueryList<NxtOptionComponent>();

      // Call the method that processes grouped options
      component['processContentProjectedOptions']();

      // Verify that grouped options are included in the options array
      expect(component['_options']).toContain(jasmine.objectContaining({
        value: 'apple',
        label: 'Apple',
        group: 'Fruits'
      }));
      
      expect(component['_options']).toContain(jasmine.objectContaining({
        value: 'banana',
        label: 'Banana',
        group: 'Fruits'
      }));
      
      expect(component['_options']).toContain(jasmine.objectContaining({
        value: 'carrot',
        label: 'Carrot',
        group: 'Vegetables'
      }));
      
      expect(component['_options']).toContain(jasmine.objectContaining({
        value: 'broccoli',
        label: 'Broccoli',
        disabled: true,
        group: 'Vegetables'
      }));
    });

    it('should show group headers correctly', () => {
      // Set up options with groups
      component['_options'] = [
        { value: 'apple', label: 'Apple', group: 'Fruits' },
        { value: 'banana', label: 'Banana', group: 'Fruits' },
        { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
        { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' }
      ];
      
      component.updateFilteredOptions();

      // Test shouldShowGroupHeader method
      expect(component.shouldShowGroupHeader(component.filteredOptions[0], 0)).toBe(true); // First fruit
      expect(component.shouldShowGroupHeader(component.filteredOptions[1], 1)).toBe(false); // Second fruit
      expect(component.shouldShowGroupHeader(component.filteredOptions[2], 2)).toBe(true); // First vegetable
      expect(component.shouldShowGroupHeader(component.filteredOptions[3], 3)).toBe(false); // Second vegetable
    });
  });
}); 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NtxSelectOption } from '../ntx-select/ntx-select.component';

@Component({
  selector: 'app-ntx-select-demo',
  templateUrl: './ntx-select-demo.component.html',
  styleUrls: ['./ntx-select-demo.component.scss']
})
export class NtxSelectDemoComponent implements OnInit {
  // Template-driven form value
  selectedValue: any = null;
  selectedMultipleValues: any[] = [];
  selectedMultipleValuesWithConfirmation: any[] = [];

  // Reactive form
  reactiveForm: FormGroup;

  // Sample options
  options: NtxSelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
    { value: 'option4', label: 'Option 4' },
    { value: 'option5', label: 'Option 5' },
    { value: 'option6', label: 'Option 6' },
    { value: 'option7', label: 'Option 7' },
    { value: 'option8', label: 'Option 8' },
    { value: 'option9', label: 'Option 9' },
    { value: 'option10', label: 'Option 10' }
  ];

  countryOptions: NtxSelectOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' }
  ];

  constructor(private fb: FormBuilder) {
    this.reactiveForm = this.fb.group({
      singleSelect: ['', Validators.required],
      multipleSelect: [[], Validators.required],
      multipleSelectWithConfirmation: [[], Validators.required],
      country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Subscribe to form changes
    this.reactiveForm.valueChanges.subscribe(values => {
      console.log('Reactive form values:', values);
    });
  }

  onSelectionChange(value: any): void {
    console.log('Selection changed:', value);
  }

  onSubmit(): void {
    if (this.reactiveForm.valid) {
      console.log('Form submitted:', this.reactiveForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  resetForm(): void {
    this.reactiveForm.reset();
    this.selectedValue = null;
    this.selectedMultipleValues = [];
    this.selectedMultipleValuesWithConfirmation = [];
  }
} 
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { NxtDropdownComponent } from './nxt-dropdown/nxt-dropdown.component';
import { NxtOptionComponent } from './nxt-dropdown/components/nxt-option/nxt-option.component';
import { NxtOptionGroupComponent } from './nxt-dropdown/components/nxt-option-group/nxt-option-group.component';
import { NxtDropdownTriggerComponent } from './nxt-dropdown/components/nxt-dropdown-trigger/nxt-dropdown-trigger.component';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, MaterialModule],
  declarations: [AppComponent, NxtDropdownComponent, NxtOptionComponent, NxtOptionGroupComponent, NxtDropdownTriggerComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { MaterialModule } from './material.module';
import { NxtDropdownComponent } from './nxt-dropdown/nxt-dropdown.component';
import { NxtOptionComponent } from './nxt-dropdown/components/nxt-option/nxt-option.component';
import { NxtOptionGroupComponent } from './nxt-dropdown/components/nxt-option-group/nxt-option-group.component';
import { NxtDropdownTriggerComponent } from './nxt-dropdown/components/nxt-dropdown-trigger/nxt-dropdown-trigger.component';
import { NxtDropdownDemoComponent } from './nxt-dropdown-demo/nxt-dropdown-demo.component';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, MaterialModule],
  declarations: [AppComponent, HelloComponent, NxtDropdownComponent, NxtOptionComponent, NxtOptionGroupComponent, NxtDropdownTriggerComponent, NxtDropdownDemoComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

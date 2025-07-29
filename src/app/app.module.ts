import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { MaterialModule } from './material.module';
import { NxtDropdownComponent } from './nxt-dropdown/nxt-dropdown.component';
import { NxtDropdownDemoComponent } from './nxt-dropdown-demo/nxt-dropdown-demo.component';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, MaterialModule],
  declarations: [AppComponent, HelloComponent, NxtDropdownComponent, NxtDropdownDemoComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { MaterialModule } from './material.module';
import { NtxSelectComponent } from './ntx-select/ntx-select.component';
import { NtxSelectDemoComponent } from './ntx-select-demo/ntx-select-demo.component';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, MaterialModule],
  declarations: [AppComponent, HelloComponent, NtxSelectComponent, NtxSelectDemoComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

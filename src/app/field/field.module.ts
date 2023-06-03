import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FieldComponent} from "./field.component";
@NgModule({
  declarations: [
    FieldComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  exports: [
    FieldComponent
  ],
  bootstrap: []
})
export class FieldModule { }

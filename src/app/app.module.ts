import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SortingTableComponent } from './sorting-table/sorting-table.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { SortComponent } from './sorting-table/header-row/header-row.component';

@NgModule({
  declarations: [
    AppComponent,
    SortingTableComponent,
    SortComponent,
  ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

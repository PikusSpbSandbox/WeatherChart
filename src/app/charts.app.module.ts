import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

import { ChartsAppComponent } from './charts.app.component';
import { ChartsComponent } from './charts/charts.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';

@NgModule({
  declarations: [
    ChartsAppComponent,
    ChartsComponent,
    BarChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [ChartsAppComponent]
})
export class ChartsAppModule { }

@NgModule({})
export class ChartsSharedModule {
  static forRoot(): ModuleWithProviders<ChartsSharedModule> {
    return {
      ngModule: ChartsAppModule,
      providers: []
    }
  }
}

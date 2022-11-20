import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ChartsAppComponent } from './charts.app.component';
import { ChartsComponent } from './charts/charts.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { HttpClientModule } from "@angular/common/http";

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
export class ChartsAppModule {
  static forRoot(): ModuleWithProviders<ChartsAppModule> {
    return {
      ngModule: ChartsAppModule,
      providers: []
    }
  }
}

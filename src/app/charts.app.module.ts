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
  exports: [
    ChartsAppComponent
  ],
  providers: [],
  bootstrap: [ChartsAppComponent]
})
export class ChartsAppModule { }

@NgModule({})
export class ChartsSharedAppModule {
  static forRoot(): ModuleWithProviders<ChartsSharedAppModule> {
    return {
      ngModule: ChartsAppModule,
      providers: []
    }
  }
}

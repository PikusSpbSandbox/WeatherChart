import { Component, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";

export interface WeatherAbstractData {
  rus: any[];
  capitals: any[];
  favourite: any[];
  average: any[];
}

const QUERY_INTERVAL = 1000 * 60 * 5;
const emptyDataObjectStub = {
  rus: [],
  capitals: [],
  favourite: [],
  average: []
} as WeatherAbstractData;

@Component({
  selector: 'charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.less']
})
export class ChartsComponent {
  @Input() previewMode: boolean = false;

  labels: WeatherAbstractData = {...emptyDataObjectStub};
  values: WeatherAbstractData = {...emptyDataObjectStub};

  constructor(private http: HttpClient) {
    this.startGettingData();
  }

  private startGettingData() {
    this.doQueryWeather();
    setInterval(() => {
      this.doQueryWeather();
    }, QUERY_INTERVAL);
  }

  private doQueryWeather() {
    return this.requestWeather().then(data => {
      if (data && data.values) {
        this.values = data.values;
        this.labels = data.labels;
      } else {
        this.values = this.labels = {...emptyDataObjectStub};
      }
    }).catch(() => {
      this.values = this.labels = {...emptyDataObjectStub};
    });
  }

  private requestWeather(): Promise<any> {
    const url = `/assets/scripts/weather-nodejs-proxy.php?rnd=` + Date.now();
    return this.http.get(url).toPromise();
  }
}

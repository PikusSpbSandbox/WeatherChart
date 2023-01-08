import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";

const QUERY_INTERVAL = 1000 * 60 * 5;

@Component({
  selector: 'charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.less']
})
export class ChartsComponent {
  labels: any = {};
  values: any = {};

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
      this.values = data.values;
      this.labels = data.labels;
    });
  }

  private requestWeather(): Promise<any> {
    const url = `/assets/scripts/weather-nodejs-proxy.php?rnd=` + Date.now();
    return this.http.get(url).toPromise();
  }
}

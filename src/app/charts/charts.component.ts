import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";

const CITIES = [
  'Quebec (CAN)',
  'Murmansk (RUS)',
  'St.-Petersburg (RUS)',
  'Roschino (RUS)',
  'Moscow (RUS)',
  'Galway (IRL)',
  'Munich (DEU)',
  'Valencia (ESP)',
  'Cairo (EGY)',
  'Sydney (AUS)',
  'Kinshasa (COG)',
  'Nicosia (CYP)',
  'Brasilia (BRA)'
];
const CITIES_QUERY_URLS = [
  'https://api.open-meteo.com/v1/forecast?latitude=46.806912&longitude=-71.211776&current_weather=true',
  'https://api.open-meteo.com/v1/forecast?latitude=68.970143&longitude=33.074664&current_weather=true',
  'https://api.open-meteo.com/v1/forecast?latitude=59.9375&longitude=30.3125&current_weather=true',
  'https://api.open-meteo.com/v1/forecast?latitude=60.256502&longitude=29.603082&current_weather=true',
  'https://api.open-meteo.com/v1/forecast?latitude=55.755696&longitude=37.617306&current_weather=true',
  'https://api.open-meteo.com/v1/forecast?latitude=53.276113&longitude=-9.051036&current_weather=true',
  'https://api.open-meteo.com/v1/forecast?latitude=48.137439&longitude=11.5754806&current_weather=true',
  'https://api.open-meteo.com/v1/forecast?latitude=39.464170&longitude=-0.375950&current_weather=true',
  'https://api.open-meteo.com/v1/forecast?latitude=30.051434&longitude=31.245384&current_weather=true',
  'https://api.open-meteo.com/v1/forecast?latitude=-33.865045&longitude=151.215972&current_weather=true',
  'https://api.open-meteo.com/v1/forecast?latitude=-4.3016255&longitude=15.316439&current_weather=true',
  'https://api.open-meteo.com/v1/forecast?latitude=35.172867&longitude=33.354172&current_weather=true',
  'https://api.open-meteo.com/v1/forecast?latitude=-15.801398&longitude=-47.888806&current_weather=true'
];
const QUERY_INTERVAL = 1000 * 60 * 5;

@Component({
  selector: 'charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.less']
})
export class ChartsComponent {
  labels: string[];
  values: number[];

  title = 'ChartsDemo';

  constructor(private http: HttpClient) {
    this.labels = CITIES;
    this.values = new Array(CITIES.length);
    this.startGettingData();
  }

  private startGettingData() {
    this.doQueryWeather();
    setInterval(() => {
      this.doQueryWeather();
    }, QUERY_INTERVAL);
  }

  private doQueryWeather() {
    Promise.all(
      CITIES_QUERY_URLS.map((url, index) => this.getUrlAndSetToArray(url, index))
    ).then(() => {
      this.values = [...this.values];
    })
  }

  private getUrlAndSetToArray(url: string, index: number) {
    return this.http.get(url).toPromise().then(response => {
      this.values[index] = (response as any).current_weather.temperature;
    });
  }
}

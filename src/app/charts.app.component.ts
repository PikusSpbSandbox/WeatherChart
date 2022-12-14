import {Component, Input} from '@angular/core';

@Component({
  selector: 'charts-app',
  templateUrl: './charts.app.component.html',
  styleUrls: ['./charts.app.component.less']
})
export class ChartsAppComponent {
  @Input() previewMode: boolean = false;
  title = 'WeatherChart';
}

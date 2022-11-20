import {
  Component,
  ElementRef,
  AfterViewInit,
  Input,
  ViewChild, OnChanges, ViewEncapsulation
} from '@angular/core';
import Chart from 'chart.js/auto';

const COLORS = {
  darkestBlue: '#211166',
  darkBlue: '#4424D6',
  blue: '#0247FE',
  lightBlue: '#347C98',
  green: '#66B032',
  lightGreen: '#B2D732',
  yellow: '#FEFE33',
  lightOrange: '#FCCC1A',
  orange: '#FB9902',
  lightRed: '#FC600A',
  red: '#FE2712',
  black: '#000000'
}

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.less']
})
export class BarChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas')
  private canvas: ElementRef;
  private chart: Chart;

  @Input() labels: string[];
  @Input() values: number[];

  ngOnChanges() {
    if (this.chart) {
      const data = this.labels.reduce((memo: any, label, index) => {
        memo[this.values[index] || index] = label;
        return memo;
      }, {});

      // Sort by temperature values
      const values = Object.keys(data).sort((a: string, b:string) => {
        return Number(a) - Number(b);
      }).map(value => Number(value));

      const labels = values.map(value => data[value]);

      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = values as number[];

      const colors = new Array(labels.length).fill('').map((item, index) => {
        const value = values[index];
        let color;
        if (value > 30) {
          color = COLORS.red
        } else if (value > 27) {
          color = COLORS.lightRed;
        } else if (value > 24) {
          color = COLORS.orange;
        } else if (value > 21) {
          color = COLORS.lightOrange;
        } else if (value > 18) {
          color = COLORS.yellow;
        } else if (value > 15) {
          color = COLORS.lightGreen;
        } else if (value > 12) {
          color = COLORS.green;
        } else if (value > 9) {
          color = COLORS.lightBlue;
        } else if (value > 0) {
          color = COLORS.blue;
        } else if (value > -5) {
          color = COLORS.darkBlue;
        } else if (value > -10) {
          color = COLORS.darkestBlue;
        } else {
          color = COLORS.black;
        }
        return color;
      });
      this.chart.data.datasets[0].backgroundColor = colors;
      this.chart.update();
    }
  }

  ngAfterViewInit() {
    Chart.defaults.font.size = 15;
    Chart.defaults.font.family = 'Verdana';
    Chart.defaults.responsive = false;
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Temperature, C',
            data: []
          }
        ]
      },
      options: {
        indexAxis: 'y'
      }
    });
  }
}

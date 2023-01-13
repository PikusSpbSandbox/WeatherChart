import {
  Component,
  ElementRef,
  AfterViewInit,
  Input,
  ViewChild,
  OnChanges
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

  @Input() title: string;
  @Input() labels: string[] = [];
  @Input() values: number[] = [];
  @Input() sort: boolean = true;
  @Input() colors: boolean = true;
  @Input() indexAxis: "y" | "x" | undefined = 'y';

  ngOnChanges() {
    if (this.chart) {
      let labels = this.labels;
      let values = this.values;

      if (values.length > 0) {
        if (this.sort) {
          const data = this.labels.reduce((memo: any, label, index) => {
            if (memo[this.values[index]]) {
              memo[this.values[index]] = [memo[this.values[index] || index]].concat([label]);
            } else {
              memo[this.values[index]] = label;
            }
            return memo;
          }, {});

          // Sort by temperature values
          values = this.values.sort((a, b) => a - b);
          // Make labels unique
          labels = [...new Set(values.map(value => data[value]).flat())];
        }

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = values as number[];

        if (this.colors) {
          const colors = new Array(labels.length).fill('').map((item, index) => {
            const value = values[index];
            let color;
            if (value > 35) {
              color = COLORS.red
            } else if (value > 33) {
              color = COLORS.lightRed;
            } else if (value > 30) {
              color = COLORS.orange;
            } else if (value > 27) {
              color = COLORS.lightOrange;
            } else if (value > 25) {
              color = COLORS.yellow;
            } else if (value > 23) {
              color = COLORS.lightGreen;
            } else if (value > 15) {
              color = COLORS.green;
            } else if (value > 0) {
              color = COLORS.lightBlue;
            } else if (value > -5) {
              color = COLORS.blue;
            } else if (value > -10) {
              color = COLORS.darkBlue;
            } else if (value > -20) {
              color = COLORS.darkestBlue;
            } else {
              color = COLORS.black;
            }
            return color;
          });
          this.chart.data.datasets[0].backgroundColor = colors;
        }

        this.chart.update();
      } else {
        // No data is present
        const ctx = this.chart.ctx;
        const width = this.chart.width;
        const height = this.chart.height
        this.chart.clear();

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = "16px normal 'Helvetica Nueue'";
        ctx.fillText('Failed to load data. Please refresh page.', width / 2, height / 2);
        ctx.restore();
      }
    }
  }

  ngAfterViewInit() {
    Chart.defaults.font.size = 15;
    Chart.defaults.font.family = 'Verdana';
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: this.title,
            data: []
          }
        ]
      },
      options: {
        indexAxis: this.indexAxis
      }
    });
  }
}

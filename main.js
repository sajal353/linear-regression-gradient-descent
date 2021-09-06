import csv from './Housing.csv?raw';
import './style.css'
import Papa from 'papaparse';
import Chart from 'chart.js/auto';

const app = document.querySelector('#app');
var ctx1 = document.querySelector('#chart1');

let csvData = [];

const LEARNING_RATE = 0.0000001;

let thetaOne = 0;
let thetaZero = 0;

const hypothesis = (x) => {
  return thetaZero + thetaOne * x;
}

const descent = (sampleSize, xData, yData) => {
  thetaZero = thetaZero - LEARNING_RATE * (1 / sampleSize) * (hypothesis(xData) - yData);
  thetaOne = thetaOne - LEARNING_RATE * (1 / sampleSize) * (hypothesis(xData) - yData) * xData;
}

Papa.parse(csv, {
  complete: function (results) {
    results.data.forEach((d, index) => {
      if (index !== 0 && index !== results.data.length - 1) {
        csvData.push({ x: d[1], y: d[0] });
      }
    });

    let m = csvData.length;
    let mMax = Math.max.apply(Math, csvData.map((point) => { return point.x }));

    csvData.forEach(d => {
      descent(m, d.x, d.y);
    });

    let regression = [];

    for (let i = 0; i < mMax; i++) {
      regression.push({ x: i, y: hypothesis(i) });
    }

    const chart1 = new Chart(ctx1, {
      data: {
        datasets: [{
          type: 'scatter',
          label: 'Price by Area',
          data: csvData,
          backgroundColor: 'rgb(255, 99, 132)'
        },
        {
          type: 'line',
          label: `Hypothesis (α = ${LEARNING_RATE})`,
          data: regression,
          backgroundColor: 'rgb(0, 188, 212)'
        }
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              text: 'Area',
              color: 'rgb(255, 99, 132)',
              font: {
                size: 16
              },
              display: true
            },
            type: 'linear',
            position: 'bottom',
          },
          y: {
            title: {
              text: 'Price',
              color: 'rgb(255, 99, 132)',
              font: {
                size: 16
              },
              display: true
            },
            type: 'linear',
            position: 'left'
          }
        }
      }
    });
  }
});
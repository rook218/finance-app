import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Chart } from 'chart.js';


@Component({
  selector: 'app-retirement-calc',
  templateUrl: './retirement-calc.component.html',
  styleUrls: ['./retirement-calc.component.css']
})
export class RetirementCalcComponent implements OnInit {
  amortizationTable = [];
  retVal: number = 0;
  dispResults: boolean = false;
  dispMoreOptions: boolean = false;
  accountForInflation: boolean = false;
  insufficient: boolean = false;

  chartCanvas;
  growthChart;

  constructor() { }

  ngOnInit() {
    this.chartCanvas = document.getElementById('growth-chart');
    this.growthChart = new Chart(this.chartCanvas, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Wealth',
          data: this.amortizationTable,
          backgroundColor: [
            'rgba(76, 178, 76, 0.2)',
          ],
          borderColor: [
            'rgba(76, 178, 76, 1)',
          ],
          borderWidth: 3
        }]
      }
    });
  }

  onDisplayOptions() {
    this.dispMoreOptions = !this.dispMoreOptions;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.calcResults(form);
      console.log(form);
      this.createChart();
      this.dispResults = true;
    }
  }

  calcResults(resultsForm: NgForm) {
    const thisForm = resultsForm.form.controls;
    // casts all to number to avoid concatenation bugs
    const startPrin =  Number(thisForm.startPrin.value);
    const intRate =    Number(thisForm.intRate.value);
    const inflation =  Number(thisForm.inflation.value);

    let yrContrib =  Number(thisForm.yrContrib.value);
    let yrsGrowth =  Number(thisForm.yrsGrowth.value);
    let yrsRetired = Number(thisForm.yrsRetired.value);
    let retIncome =  Number(thisForm.retIncome.value);

    // resets the table so it doesn't keep appending new form
    // submissions to old data
    this.amortizationTable = [];
    // run basic functions regardless of user input

    let value: number = startPrin;
    while (yrsGrowth > 0) {
      // if we are scaling input by inflation rate
      if (thisForm.scaleInflation.value) {
        yrContrib *= ((100 + inflation) / 100 );
      }
      // add the yearly contribution at the start of the year
      value += yrContrib;
      // account for inflation before accruing interest
      value *= ((100 - inflation) / 100 );
      const baseValue = value; // this is a garbage value to calc interest
      // accrue interest
      value *= ((100 + intRate) / 100 );
      const interestAccrued = value - baseValue; // this calcs interest based on garbage value above
      // take off a year
      yrsGrowth--;
      // adjust retirement income for inflation
      retIncome *= ((100 + inflation) / 100 );
      const thisYear = {
        value: value,
        yearsLeft: yrsGrowth + yrsRetired,
        retIncomeInflated: retIncome,
        retIncomeTaken: false,
        interestAccrued: interestAccrued
      };
      this.amortizationTable.push(thisYear);
      this.retVal = value;
    }

    // if the user wants the advanced options
    if (this.dispMoreOptions) {
      if (value > 0) {
        while (yrsRetired > 0) {
          // accrue interest
          value *= (1 + (intRate / 100));
          // suffer inflation
          value *= ((100 - inflation) / 100 );
          // take income
          value -= retIncome;
          // adjust retirement income for inflation
          retIncome *= ((100 + inflation) / 100 );

          const thisYear = {
            value: value,
            yearsLeft: yrsGrowth + yrsRetired,
            retIncomeInflated: retIncome,
            retIncomeTaken: true,
            interestAccrued: Number(value - (startPrin + yrContrib))
          };

          this.amortizationTable.push(thisYear);
          yrsRetired--;
        }
      } else {
        this.insufficient = true;
        return;
      }
      this.retVal = value;
    } 
  }

  createChart() {

    // reset the canvas to avoid the weird hover bug
    this.growthChart.destroy();
    // This creates an array of labeled years for the graph to work properly
    const labels = [];
    let i: number = 1;
    this.amortizationTable.forEach((e) => {
      labels.push(i);
      i++;
    });

    // this gets only the value attribute and pushes it to an array
    const dataset = this.amortizationTable.map((element) => {
      return element.value;
    });

    // creates the graph with the data
    this.growthChart = new Chart(this.chartCanvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Wealth',
          data: dataset,
          backgroundColor: [
            'rgba(76, 178, 76, 0.2)',
          ],
          borderColor: [
            'rgba(76, 178, 76, 1)',
          ],
          borderWidth: 3
        }]
      }
    });
  }
}

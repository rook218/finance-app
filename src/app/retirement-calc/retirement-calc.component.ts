import { Component, OnInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Chart } from 'chart.js';


@Component({
  selector: 'app-retirement-calc',
  templateUrl: './retirement-calc.component.html',
  styleUrls: ['./retirement-calc.component.css']
})
export class RetirementCalcComponent implements OnInit {
  amortizationTable = [];
  retVal = 0;
  dispResults = false;
  dispMoreOptions = false;
  accountForInflation = false;
  sufficient = true;
  yrsFailed: number;
  expectedDataLength: number;

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
      this.createChart();
      this.dispResults = true;
      this.expectedDataLength = form.controls.yrsGrowth.value + form.controls.yrsRetired.value;
    }
  }

  calcResults(resultsForm: NgForm) {
    const thisForm = resultsForm.form.controls;
    // casts all to number to avoid concatenation bugs
    const startPrin =  Number(thisForm.startPrin.value);
    const intRate =    Number(thisForm.intRate.value);
    const inflation =  Number(thisForm.inflation.value);

    let yrContrib =  Number(thisForm.yrContrib.value);
    let yrsGrowth =  Number(thisForm.retAge.value - thisForm.currentAge.value);
    let yrsRetired = Number(thisForm.yrsRetired.value);
    let retIncome =  Number(thisForm.retIncome.value);
    let userAge = Number(thisForm.currentAge.value);

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

      // ** NOTE ** the below code is bad design, since it applies interest rate to regular dollars
      // it would be good for an advanced feature that puts everything in present dollars but
      // right now it only double-hits users for inflation and makes retirement almost impossible
      // value *= ((100 - inflation) / 100 );

      const baseValue = value; // this is a garbage value to calc interest accrued this year
      // accrue interest
      value *= ((100 + intRate) / 100 );
      const interestAccrued = Math.floor(value - baseValue); // this calcs interest based on garbage value above
      // take off a year
      yrsGrowth--;
      // adjust retirement income for inflation
      retIncome *= ((100 + inflation) / 100 );
      // increment age
      userAge++;
      // add all to an object
      const thisYear = {
        value: Math.floor(value),
        yearsLeft: yrsGrowth + yrsRetired,
        yrContrib: Math.floor(yrContrib),
        retIncomeInflated: Math.floor(retIncome),
        retIncomeTaken: false,
        interestAccrued: Math.floor(interestAccrued),
        userAge: userAge
      };
      // push the object to our aray
      this.amortizationTable.push(thisYear);
      this.retVal = value;
    }

    // if the user wants the advanced options
    if (this.dispMoreOptions) {
      while (yrsRetired > 0) {
        if (value >= 0) {
          const baseValue = value;
          // accrue interest
          value *= (1 + (intRate / 100));
          const interestAccrued = value - baseValue;
          // take income
          value -= retIncome;
          // adjust retirement income for inflation
          retIncome *= ((100 + inflation) / 100 );
          // increment age
          userAge++;
          // add all to an object
          const thisYear = {
            value: Math.floor(value),
            yearsLeft: yrsGrowth + yrsRetired,
            yrContrib: Math.floor(yrContrib),
            retIncomeInflated: Math.floor(retIncome),
            retIncomeTaken: false,
            interestAccrued: Math.floor(interestAccrued),
            userAge: userAge
          };

          this.amortizationTable.push(thisYear);
          yrsRetired--;
          this.sufficient = true;
        } else {
          this.sufficient = false;
          this.yrsFailed = this.expectedDataLength - this.amortizationTable.length + 2;
          break;
        }
      }
    }
  }

  createChart() {
    // reset the canvas to avoid the weird hover bug
    this.growthChart.destroy();
    // This creates an array of labeled years for the graph to work properly
    const labels = [];
    let i = 1;
    this.amortizationTable.forEach((element) => {
      labels.push(element.userAge);
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

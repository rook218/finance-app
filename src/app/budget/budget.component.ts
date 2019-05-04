import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Chart } from 'chart.js';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {

  budgetForm: FormGroup;
  formPage = 1;
  calculated = false;

  expensesGraph;
  budgetGraph;

  totals;
  budgetPercent;

  ngOnInit() {
    this.budgetForm = new FormGroup({

      // essentials
      'monthlyIncome': new FormControl(null, Validators.required),
      'rent': new FormControl(null, Validators.required),
      'utilities': new FormControl(null, Validators.required),
      'groceries': new FormControl(null, Validators.required),
      'debt': new FormControl(null, Validators.required),
      'transportation': new FormControl(null, Validators.required),
      'miscEssentials': new FormControl(null, Validators.required),

      // luxuries
      'eatingOut': new FormControl(null, Validators.required),
      'shopping': new FormControl(null, Validators.required),
      'entertainment': new FormControl(null, Validators.required),
      'gifts': new FormControl(null, Validators.required),

      // goals
      'retirement': new FormControl(null, Validators.required),
      'emergency': new FormControl(null, Validators.required),
      'investment': new FormControl(null, Validators.required),
      'miscSavings': new FormControl(null, Validators.required)
    });
    this.formPage = 1;
  }

  nextPage() {
    this.formPage++;
  }

  onSubmit() {
    this.nextPage();
    this.calcResults();
  }

  calcResults() {
    this.calculated = true;
    
    this.createDataObject();

    this.createExpensesGraph();

    this.createBudgetGraph();

  }

  createExpensesGraph() {
    this.expensesGraph = document.querySelector('#expenses-canvas');

    const ctx = this.expensesGraph;

    const data = {
      labels: [

        // essentials (6 of them)
        'Rent',
        'Utilities',
        'Groceries',
        'Debt',
        'Transportation',
        'Miscellaneous Essentials',

        // luxuries (4 of them)
        'Eating Out',
        'Shopping',
        'Entertainment',
        'Gifts',

        // savings (4 of them)
        'Retirement',
        'Emergency',
        'Investment',
        'Miscellaneous Savings'
      ],
      datasets: [{
        label: 'Monthly expenses',
        data: [

          // essentials (6 of them)
          this.budgetForm.value.rent,
          this.budgetForm.value.utilities,
          this.budgetForm.value.groceries,
          this.budgetForm.value.debt,
          this.budgetForm.value.transportation,
          this.budgetForm.value.miscEssentials,

          // luxuries (4 of them)
          this.budgetForm.value.eatingOut,
          this.budgetForm.value.shopping,
          this.budgetForm.value.entertainment,
          this.budgetForm.value.gifts,

          // savings (4 of them)
          this.budgetForm.value.retirement,
          this.budgetForm.value.emergency,
          this.budgetForm.value.investment,
          this.budgetForm.value.miscSavings
        ],
        backgroundColor: [
          // essentials (green, 6 of them)
          'rgba(40, 167, 69, 0.9)',
          'rgba(50, 170, 30, 0.9)',
          'rgba(40, 200, 70, 0.9)',
          'rgba(20, 220, 30, 0.9)',
          'rgba(10, 150, 50, 0.9)',
          'rgba(0, 230, 64, 0.9)',

          // luxuries (orange, 4 of them)
          'rgba(253, 100, 40, 0.9)',
          'rgba(253, 70, 100, 0.9)',
          'rgba(241, 90, 34, 0.9)',
          'rgba(249, 191, 59, 0.9)',

          // savings (blue, 4 of them)
          'rgba(0, 181, 204, 0.9)',
          'rgba(51, 110, 123, 0.9)',
          'rgba(34, 167, 240, 0.9)',
          'rgba(92, 151, 191, 0.9)'
        ]
      }]

    };

    this.expensesGraph = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {}
    });
  }

  createBudgetGraph() {

    const ctx = document.querySelector('#exp-vs-income-canvas');

    const totalExpenses = this.totals.totalExpenses;
    const totalIncome = this.totals.income;

    if (totalExpenses > totalIncome) {
      const overagePercent = Math.floor((totalExpenses - totalIncome) / totalIncome * 100);
      const data = {
        datasets: [{
          data: [overagePercent, (100 - overagePercent)],
          backgroundColor: [
            'rgba(150, 0, 24, 0.9)',
            'rgba(180, 220, 100, 0.9)'
          ],
        }],
        labels: ['Budget broken by']
      };

      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {}
      });
    } else {

      const data = {
        datasets: [{
          data: [totalExpenses, (totalIncome - totalExpenses)],
          backgroundColor: [
            'rgba(150, 0, 24, 0.9)',
            'rgba(180, 220, 100, 0.9)'
          ],
        }],
        labels: ['Total Expenses', 'Remaining Cash']
      };

      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {}
      });
    }

  }

  createDataObject() {

    // gobbledygook that just adds all the expenses so I can add it
    // to my object
    let expenses = Object.values(this.budgetForm.value);
    expenses.splice(0, 1);
    let totalExpenses = 0;
    expenses.forEach((expense: number) => {
      totalExpenses += expense;
    });

    this.totals = {
      income: this.budgetForm.value.monthlyIncome,
      totalExpenses: totalExpenses,
      essentials: {
        rent: this.budgetForm.value.rent,
        utilities: this.budgetForm.value.utilities,
        groceries: this.budgetForm.value.groceries,
        debt: this.budgetForm.value.debt,
        transportation: this.budgetForm.value.transportation,
        miscEssentials: this.budgetForm.value.miscEssentials,
      },
      luxuries: {
        eatingOut: this.budgetForm.value.eatingOut,
        shopping: this.budgetForm.value.shopping,
        entertainment: this.budgetForm.value.entertainment,
        gifts: this.budgetForm.value.gifts
      },
      savings: {
        retirement: this.budgetForm.value.retirement,
        emergency: this.budgetForm.value.emergency,
        investment: this.budgetForm.value.investment,
        miscSavings: this.budgetForm.value.miscSavings
      }
    };
    this.budgetPercent  = Math.floor((this.totals.totalExpenses / this.totals.income) * 100)
  }


}

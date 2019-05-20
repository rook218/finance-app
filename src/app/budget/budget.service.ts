import { Injectable } from '@angular/core';

import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root'
})

export class BudgetService {

  constructor() { }

  totals;

  createDataObject(budgetForm) {

    // gobbledygook that just adds all the expenses so I can add it
    // to my object
    const expenses = Object.values(budgetForm.value);
    expenses.splice(0, 1);
    let totalExpenses = 0;
    expenses.forEach((expense: number) => {
      totalExpenses += expense;
    });

    this.totals = {
      income: budgetForm.value.monthlyIncome,
      totalExpenses: totalExpenses,
      essentials: {
        rent: budgetForm.value.rent,
        utilities: budgetForm.value.utilities,
        groceries: budgetForm.value.groceries,
        debt: budgetForm.value.debt,
        transportation: budgetForm.value.transportation,
        miscEssentials: budgetForm.value.miscEssentials,
      },
      luxuries: {
        eatingOut: budgetForm.value.eatingOut,
        shopping: budgetForm.value.shopping,
        entertainment: budgetForm.value.entertainment,
        gifts: budgetForm.value.gifts
      },
      savings: {
        retirement: budgetForm.value.retirement,
        emergency: budgetForm.value.emergency,
        investment: budgetForm.value.investment,
        miscSavings: budgetForm.value.miscSavings
      }
    };
    this.totals['budgetPercent'] = Math.floor((this.totals.totalExpenses / this.totals.income) * 100);
  }

  createExpensesGraphData() {
    const ctx = document.querySelector('#expenses-canvas');

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
          this.totals.essentials.rent,
          this.totals.essentials.utilities,
          this.totals.essentials.groceries,
          this.totals.essentials.debt,
          this.totals.essentials.transportation,
          this.totals.essentials.miscEssentials,

          // luxuries (4 of them)
          this.totals.luxuries.eatingOut,
          this.totals.luxuries.shopping,
          this.totals.luxuries.entertainment,
          this.totals.luxuries.gifts,

          // savings (4 of them)
          this.totals.savings.retirement,
          this.totals.savings.emergency,
          this.totals.savings.investment,
          this.totals.savings.miscSavings
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

    this.totals.expensesData = data;
  }

  createBudgetGraphData() {
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
      this.totals.budgetData = data;

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
      this.totals.budgetData = data;
    }
  }

  createIdealGraphData() {
    // TO DO - Create warnings of overspending
    const ctx = document.querySelector('#ideal-canvas');

    const income = this.totals.income;
    const expenses = this.totals;
    const essentials = {
      rent: (income * 0.3),
      utilities: expenses.essentials.utilities,
      groceries: expenses.essentials.groceries,
      debt: expenses.essentials.debt,
      transportation: expenses.essentials.transportation,
      miscEssentials: expenses.essentials.miscEssentials,
    };

    // if statements to make a logical budget
    if (this.totals.essentials.rent <= essentials.rent) {
      essentials.rent = this.totals.essentials.rent;
    }
    if (essentials.transportation > 300) {
      essentials.transportation = 300;
    }

    const disposableIncome = Math.floor(income -
                                        essentials.rent -
                                        essentials.utilities -
                                        essentials.groceries -
                                        essentials.debt -
                                        essentials.transportation -
                                        essentials.miscEssentials);

    // should add up to 0.6
    const luxuries = {
      eatingOut: Math.floor(disposableIncome * 0.15),
      entertainment: Math.floor(disposableIncome * 0.1),
      gifts: Math.floor(disposableIncome * 0.1),
      shopping: Math.floor(disposableIncome * 0.15),
    };

    // should add up to 0.4
    const goals = {
      emergency: Math.floor(disposableIncome * 0.075),
      investment: Math.floor(disposableIncome * 0.15),
      miscSavings: Math.floor(disposableIncome * 0.025),
      retirement: Math.floor(disposableIncome * 0.25),
    };

    const data = {
      datasets: [{
        data: [
          essentials.rent,
          essentials.utilities,
          essentials.groceries,
          essentials.debt,
          essentials.transportation,
          essentials.miscEssentials,

          luxuries.eatingOut,
          luxuries.shopping,
          luxuries.entertainment,
          luxuries.gifts,

          goals.retirement,
          goals.emergency,
          goals.investment,
          goals.miscSavings
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
      }],
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
    };

    this.totals.idealData = data;
  }

  deleteExtraData() {
    console.log('before deleteExtraData');
    console.log(this.totals);

    delete this.totals.essentials;
    delete this.totals.luxuries;
    delete this.totals.savings;

    console.log('after deleteExtraData');
    console.log(this.totals);
  }

  createGraph(canvas, data) {
      const chart = new Chart(canvas, {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: true,
        }
      });
    }
}

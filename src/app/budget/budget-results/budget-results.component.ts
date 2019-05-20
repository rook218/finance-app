import { Component, OnInit } from '@angular/core';

import { BudgetService } from '../budget.service';

@Component({
  selector: 'app-budget-results',
  templateUrl: './budget-results.component.html',
  styleUrls: ['./budget-results.component.css']
})
export class BudgetResultsComponent implements OnInit {

  constructor(private budgetService: BudgetService) { }

  ngOnInit() {
    // creates budget graph
    let ctx = document.querySelector('#exp-vs-income-canvas');
    this.budgetService.createGraph(ctx, this.budgetService.totals.budgetData);

    // create expenses graph
    ctx = document.querySelector('#expenses-canvas');
    this.budgetService.createGraph(ctx, this.budgetService.totals.expensesData);

    // create ideal graph
    ctx = document.querySelector('#ideal-canvas');
    this.budgetService.createGraph(ctx, this.budgetService.totals.idealData);
  }

}

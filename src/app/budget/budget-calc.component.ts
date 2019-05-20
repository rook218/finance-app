import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { BudgetService } from './budget.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budget',
  templateUrl: './budget-calc.component.html',
  styleUrls: ['./budget-calc.component.css']
})
export class BudgetCalcComponent implements OnInit {

  budgetForm: FormGroup;
  formPage = 1;
  calculated = false;

  expensesGraph;
  budgetGraph;
  idealGraph;

  totals;
  budgetPercent;

  constructor(
    private budgetService: BudgetService,
    private router: Router
  ) {}

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
    this.router.navigate(['/budget/results'])
  }

  calcResults() {
    this.calculated = true;
    this.budgetService.createDataObject(this.budgetForm);

    this.budgetService.createExpensesGraphData();
    this.budgetService.createBudgetGraphData();
    this.budgetService.createIdealGraphData();
    this.budgetService.deleteExtraData();

    console.log('totals object should be complete');
    console.log(this.budgetService.totals);
  }

}

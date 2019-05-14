import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { GuideComponent } from './guide/guide.component';
import { RetirementCalcComponent } from './retirement-calc/retirement-calc.component';
import { LoanComponent } from './loan/loan.component';
import { BudgetComponent } from './budget/budget.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'beginner-guide', component: GuideComponent},
  {path: 'retirement', component: RetirementCalcComponent},
  {path: 'loan', component: LoanComponent},
  {path: 'budget', component: BudgetComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    RetirementCalcComponent,
    GuideComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    BudgetComponent,
    LoanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule { }

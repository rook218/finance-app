import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RetirementCalcComponent } from './retirement-calc/retirement-calc.component';
import { EncyclopediaComponent } from './encyclopedia/encyclopedia.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { BudgetComponent } from './budget/budget.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'encyclopeida', component: EncyclopediaComponent},
  {path: 'retirement', component: RetirementCalcComponent},
  // {path: 'loan', component: HomeComponent},
  {path: 'budget', component: BudgetComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    RetirementCalcComponent,
    EncyclopediaComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    BudgetComponent
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

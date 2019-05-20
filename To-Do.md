# BudgetComponent

Created a new service for the budget component but did not finish the logic behind it. Currently each create___ChartData() function ends by calling the createGraphs() function, which breaks because I 1) never call the budget-results component to the DOM, which has the canvases for the graphs, and 2) I need to figure out how to get the budget-results componet to call that function onInit without screwing up the way the data is passed

Also need to create an object that I can iterate over to create a nice exportable chart to show actual budget vs ideal budget, and provide values for use in the retirement calculator.

## All calculators

Add an info button that will describe the term when you hover over it. Will clean up the budget calculator and make the retirement calculator more useable.
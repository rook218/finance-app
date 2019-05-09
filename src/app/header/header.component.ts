import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  dropdownButton;
  dropdownContainer;
  
  ngOnInit() {
    this.dropdownButton = document.querySelector('.dropdown-button');
    this.dropdownContainer = document.querySelector('.dropdown-container');
  }

  toggleDropdown() {
    this.dropdownContainer.classList.toggle('hidden');
  };



}

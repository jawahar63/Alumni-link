import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  filter='';
  datas =[
    {
      mentor: "Kabi",
      eventName: "Alumni meet",
      AlumniName: "Sanjay S",
      typeofEvent: "seminar",
      fromDate: "20.10.24",
      toDate: "21.10.24",
      mode: "offline",
      venue: "SF1"
    },
    {
      mentor: "ragul",
      eventName: "Alumni meet",
      AlumniName: "Sanjay S",
      typeofEvent: "seminar",
      fromDate: "20.10.24",
      toDate: "21.10.24",
      mode: "offline",
      venue: "SF1"
    },
    {
      mentor: "jeeva",
      eventName: "Alumni meet",
      AlumniName: "Sanjay S",
      typeofEvent: "seminar",
      fromDate: "20.10.24",
      toDate: "21.10.24",
      mode: "offline",
      venue: "SF1"
    },
    {
      mentor: "dharani",
      eventName: "Alumni meet",
      AlumniName: "Sanjay S",
      typeofEvent: "seminar",
      fromDate: "20.10.24",
      toDate: "21.10.24",
      mode: "offline",
      venue: "SF1"
    },
    {
      mentor: "dharani",
      eventName: "Alumni meet",
      AlumniName: "Sanjay S",
      typeofEvent: "seminar",
      fromDate: "20.10.24",
      toDate: "21.10.24",
      mode: "offline",
      venue: "SF1"
    },
    {
      mentor: "dharani",
      eventName: "Alumni meet",
      AlumniName: "Sanjay S",
      typeofEvent: "seminar",
      fromDate: "20.10.24",
      toDate: "21.10.24",
      mode: "offline",
      venue: "SF1"
    },
    {
      mentor: "dharani",
      eventName: "Alumni meet",
      AlumniName: "Sanjay S",
      typeofEvent: "seminar",
      fromDate: "20.10.24",
      toDate: "21.10.24",
      mode: "offline",
      venue: "SF1"
    },
    {
      mentor: "dharani",
      eventName: "Alumni meet",
      AlumniName: "Sanjay S",
      typeofEvent: "seminar",
      fromDate: "20.10.24",
      toDate: "21.10.24",
      mode: "offline",
      venue: "SF1"
    },
    {
      mentor: "dharani",
      eventName: "Alumni meet",
      AlumniName: "Sanjay S",
      typeofEvent: "seminar",
      fromDate: "20.10.24",
      toDate: "21.10.24",
      mode: "offline",
      venue: "SF1"
    },
    {
      mentor: "dharani",
      eventName: "Alumni meet",
      AlumniName: "Sanjay S",
      typeofEvent: "seminar",
      fromDate: "20.10.24",
      toDate: "21.10.24",
      mode: "offline",
      venue: "SF1"
    },
    {
      mentor: "dharani",
      eventName: "Alumni meet",
      AlumniName: "Sanjay S",
      typeofEvent: "seminar",
      fromDate: "20.10.24",
      toDate: "21.10.24",
      mode: "offline",
      venue: "SF1"
    },
    {
      mentor: "dharani",
      eventName: "Alumni meet",
      AlumniName: "Sanjay S",
      typeofEvent: "seminar",
      fromDate: "20.10.24",
      toDate: "21.10.24",
      mode: "offline",
      venue: "SF1"
    },
    {
      mentor: "dharani",
      eventName: "Alumni meet",
      AlumniName: "Sanjay S",
      typeofEvent: "seminar",
      fromDate: "20.10.24",
      toDate: "21.10.24",
      mode: "offline",
      venue: "SF1"
    },
    {
      mentor: "dharani",
      eventName: "Alumni meet",
      AlumniName: "Sanjay S",
      typeofEvent: "seminar",
      fromDate: "20.10.24",
      toDate: "21.10.24",
      mode: "offline",
      venue: "SF1"
    },

  ]
  currentPage=1;
  itemsPerPage: number = 5;
  totalItems: number = this.datas.length;
  ngOnInit(): void {

  }
  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.datas.slice(startIndex, startIndex + this.itemsPerPage);
  }
  get pageNumbers() {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
  changePage(page: number) {
    this.currentPage = page;
  }
   get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}

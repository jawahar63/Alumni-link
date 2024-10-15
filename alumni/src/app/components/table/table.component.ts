import { CommonModule } from '@angular/common';
import { Component, inject, Input, input, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Event } from '../../models/event.model';
import { AuthService } from '../../servies/auth.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {

  authService=inject(AuthService);
  filter='';
  @Input() datas:Event[]=[]
  @Input() extraHeaderTemplate?: TemplateRef<any>;
  @Input() extraRowTemplate?: TemplateRef<any>; 
  @Input() create?:TemplateRef<any>;
  // datas =[
  //   {
  //     mentor: "Kabi",
  //     eventName: "Alumni meet",
  //     AlumniName: "Sanjay S",
  //     typeofEvent: "seminar",
  //     fromDate: "20.10.24",
  //     toDate: "21.10.24",
  //     mode: "offline",
  //     venue: "SF1"
  //   },
  //   {
  //     mentor: "ragul",
  //     eventName: "Alumni meet",
  //     AlumniName: "Sanjay S",
  //     typeofEvent: "seminar",
  //     fromDate: "20.10.24",
  //     toDate: "21.10.24",
  //     mode: "offline",
  //     venue: "SF1"
  //   },
  //   {
  //     mentor: "jeeva",
  //     eventName: "Alumni meet",
  //     AlumniName: "Sanjay S",
  //     typeofEvent: "seminar",
  //     fromDate: "20.10.24",
  //     toDate: "21.10.24",
  //     mode: "offline",
  //     venue: "SF1"
  //   },
  //   {
  //     mentor: "dharani",
  //     eventName: "Alumni meet",
  //     AlumniName: "Sanjay S",
  //     typeofEvent: "seminar",
  //     fromDate: "20.10.24",
  //     toDate: "21.10.24",
  //     mode: "offline",
  //     venue: "SF1"
  //   },
  //   {
  //     mentor: "dharani",
  //     eventName: "Alumni meet",
  //     AlumniName: "Sanjay S",
  //     typeofEvent: "seminar",
  //     fromDate: "20.10.24",
  //     toDate: "21.10.24",
  //     mode: "offline",
  //     venue: "SF1"
  //   },
  //   {
  //     mentor: "dharani",
  //     eventName: "Alumni meet",
  //     AlumniName: "Sanjay S",
  //     typeofEvent: "seminar",
  //     fromDate: "20.10.24",
  //     toDate: "21.10.24",
  //     mode: "offline",
  //     venue: "SF1"
  //   },
  //   {
  //     mentor: "dharani",
  //     eventName: "Alumni meet",
  //     AlumniName: "Sanjay S",
  //     typeofEvent: "seminar",
  //     fromDate: "20.10.24",
  //     toDate: "21.10.24",
  //     mode: "offline",
  //     venue: "SF1"
  //   },
  //   {
  //     mentor: "dharani",
  //     eventName: "Alumni meet",
  //     AlumniName: "Sanjay S",
  //     typeofEvent: "seminar",
  //     fromDate: "20.10.24",
  //     toDate: "21.10.24",
  //     mode: "offline",
  //     venue: "SF1"
  //   },
  //   {
  //     mentor: "dharani",
  //     eventName: "Alumni meet",
  //     AlumniName: "Sanjay S",
  //     typeofEvent: "seminar",
  //     fromDate: "20.10.24",
  //     toDate: "21.10.24",
  //     mode: "offline",
  //     venue: "SF1"
  //   },
  //   {
  //     mentor: "dharani",
  //     eventName: "Alumni meet",
  //     AlumniName: "Sanjay S",
  //     typeofEvent: "seminar",
  //     fromDate: "20.10.24",
  //     toDate: "21.10.24",
  //     mode: "offline",
  //     venue: "SF1"
  //   },
  //   {
  //     mentor: "dharani",
  //     eventName: "Alumni meet",
  //     AlumniName: "Sanjay S",
  //     typeofEvent: "seminar",
  //     fromDate: "20.10.24",
  //     toDate: "21.10.24",
  //     mode: "offline",
  //     venue: "SF1"
  //   },
  //   {
  //     mentor: "dharani",
  //     eventName: "Alumni meet",
  //     AlumniName: "Sanjay S",
  //     typeofEvent: "seminar",
  //     fromDate: "20.10.24",
  //     toDate: "21.10.24",
  //     mode: "offline",
  //     venue: "SF1"
  //   },
  //   {
  //     mentor: "dharani",
  //     eventName: "Alumni meet",
  //     AlumniName: "Sanjay S",
  //     typeofEvent: "seminar",
  //     fromDate: "20.10.24",
  //     toDate: "21.10.24",
  //     mode: "offline",
  //     venue: "SF1"
  //   },
  //   {
  //     mentor: "dharani",
  //     eventName: "Alumni meet",
  //     AlumniName: "Sanjay S",
  //     typeofEvent: "seminar",
  //     fromDate: "20.10.24",
  //     toDate: "21.10.24",
  //     mode: "offline",
  //     venue: "SF1"
  //   },

  // ]
  isMentor:boolean=false;
  isAlumni:boolean=false;
  currentPage=1;
  itemsPerPage: number = 5;
  totalItems: number = this.datas.length;
  ngOnInit(): void {
    this.authService.AuthData.subscribe((data)=>{
      this.isMentor=data.get('role')==='mentor';
      this.isAlumni=data.get('role')==='alumni';
    })
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
  ChangeStatus(Status:String){
  }
}

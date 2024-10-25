import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ConvoService } from '../../servies/convo.service';
import { ToasterService } from '../../servies/toaster.service';
import { debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-convo',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule,MatIconModule],
  templateUrl: './convo.component.html',
  styleUrl: './convo.component.css'
})
export class ConvoComponent implements OnInit {
  @Input() data:any=[]
  filter=''
  searchTermControl = new FormControl();
  showSearch=false;
  suggestions: any[] = [];
  convoService=inject(ConvoService);
  toasterService=inject(ToasterService);

  ngOnInit(): void {
    this.searchTermControl.valueChanges.pipe(
      debounceTime(300),
      switchMap(searchTerm => {
        if (searchTerm) {
          return this.convoService.searchUser(searchTerm); 
        } else {
          return [];
        }
      })
    ).subscribe(
      data => {
        this.suggestions = data;
      },
      error => {
        console.error('Error fetching suggestions', error);
      }
    );
  }
  searchbar(){
    this.showSearch=true
  }

}

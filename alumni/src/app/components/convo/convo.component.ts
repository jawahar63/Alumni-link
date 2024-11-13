import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ConvoService } from '../../servies/convo.service';
import { ToasterService } from '../../servies/toaster.service';
import { debounceTime, switchMap } from 'rxjs';
import { Convo } from '../../models/convo.model';
import { AuthService } from '../../servies/auth.service';
import { MessageService } from '../../servies/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-convo',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule,MatIconModule],
  templateUrl: './convo.component.html',
  styleUrl: './convo.component.css'
})
export class ConvoComponent implements OnInit {
  @Input() datas:Convo[]=[];
  width!:number;
  filter=''
  searchTermControl = new FormControl();
  showSearch=false;
  suggestions: any[] = [];
  id='';
  convoService=inject(ConvoService);
  messageService=inject(MessageService);
  authService=inject(AuthService);
  toasterService=inject(ToasterService);
  router=inject(Router)

  ngOnInit(): void {
    this.width=window.innerWidth;
    this.authService.AuthData.subscribe((data)=>{
      this.id=data.get('user_id');
    })
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
        this.toasterService.addToast('error','Error1',error.message,5000);
      }
    );

    this.convoService.changeConvoDetail().subscribe((convo:Convo)=>{
      const convoIndex = this.datas.findIndex((data) => data._id === convo._id);
      if (convoIndex !== -1) {
        this.datas[convoIndex] = convo;
      }
    })
  }
  @HostListener('window:resize',['$event'])
  onResize(event: Event): void {
    this.width=window.innerWidth;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const isClickInside = target.closest('.suggestion-box') || target.closest('.search-input');
    if (!isClickInside) {
      this.suggestions = []; // Clear suggestions if click is outside
    }
  }
  searchbar(){
    this.showSearch=!this.showSearch
  }
  openConvo(Convo:Convo){
    this.messageService.getConvoDetail(Convo);
    if(this.width<768){
      this.router.navigate(['message/chat']);
    }
  }

  newConvo(suggestion:any){
    const isThere=this.datas.some( d =>d.participant._id===suggestion._id)
    if(!isThere){
      const participants=[this.id,suggestion._id]
      this.convoService.createConvo(participants).subscribe({
        next:(value)=> {
          this.datas.unshift(value.data);
        },
        error:(err)=> {
          this.toasterService.addToast('error','Error1',err.error.message,5000);
        },
      })
    }
    else{
      const convo =this.datas.find(d=>d.participant._id===suggestion._id);
      if (convo) {
        this.openConvo(convo);
      }
    }
    this.searchTermControl.setValue('');
    this.suggestions=[];
    this.showSearch=false;
  }

  getDisplayDate(date: string | Date): string {
    const messageDate = new Date(date);
    const today = new Date();

    const isToday = 
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();

    const isYesterday = 
      messageDate.getDate() === today.getDate() - 1 &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();

    if (isToday) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString(); // Customize date format as needed
    }
  }

}

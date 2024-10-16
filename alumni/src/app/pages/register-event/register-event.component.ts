import { Component, inject, OnInit } from '@angular/core';
import { EventService } from '../../servies/event.service';
import { ToasterService } from '../../servies/toaster.service';
import { AuthService } from '../../servies/auth.service';
import { Router } from '@angular/router';
import { TableComponent } from '../../components/table/table.component';
import { Event } from '../../models/event.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-event',
  standalone: true,
  imports: [TableComponent,CommonModule,FormsModule],
  templateUrl: './register-event.component.html',
  styleUrl: './register-event.component.css'
})
export class RegisterEventComponent implements OnInit {
  id:string='';
  isStudent=false;
  email='';
  username='';
  rollno=''
  eventService=inject(EventService);
  toasterService=inject(ToasterService);
  authService=inject(AuthService);
  router=inject(Router)
  event:Event[]=[]

  ngOnInit(): void {
    this.authService.AuthData.subscribe((data)=>{
      this.id=data.get('user_id');
      this.isStudent=data.get('role')==='User';
    })
    if(!this.isStudent)
      this.router.navigate(['home']);
    this.eventService.getApprovedEvent(this.id).subscribe({
      next:(value)=> {
        this.event=value.data;
      },
      error:(err)=> {
        this.toasterService.addToast('error','Error1',err.message,5000);
      },
    })
  }
  Register(data:Event){
    data.showRegister=true;
  }

  closeRegisterPopup(data:Event){
    data.showRegister=false;
  }
  RegisterEvent(data:Event){
    this.eventService.RegisterEvent(data._id,this.id).subscribe({
      next:(value)=> {
        this.toasterService.addToast('success','Success!',value.message,5000);
      },
      error:(err)=> {
        this.toasterService.addToast('error','Error1',err.message,5000);
      },
    })
    data.showRegister=false;
  }
}

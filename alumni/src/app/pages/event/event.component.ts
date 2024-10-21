import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { TableComponent } from '../../components/table/table.component';
import { EventService } from '../../servies/event.service';
import { AuthService } from '../../servies/auth.service';
import { Event, registerStudents } from '../../models/event.model';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../../servies/toaster.service';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SimpleTableComponent } from '../../components/simple-table/simple-table.component';
import { EditEventComponent } from "../edit-event/edit-event.component";

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [HeaderComponent, TableComponent, CommonModule, FormsModule, SimpleTableComponent, EditEventComponent],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent implements OnInit {

  eventService=inject(EventService);
  authService=inject(AuthService);
  toasterService=inject(ToasterService);
  router=inject(Router)

  id:String='';
  isMentor:boolean=false;
  isAlumni:boolean=false;
  title='';
  event:Event[]=[]
  RegisterStudents:registerStudents[]=[]

  ngOnInit(): void {
    this.authService.AuthData.subscribe((data)=>{
      this.id=data.get('user_id');
      this.isMentor=data.get('role')==='mentor';
      this.isAlumni=data.get('role')==='alumni';
    })
    this.eventService.getEvent(this.id).subscribe({
      next:(value)=> {
        this.event=value.data;
      },
      error:(err)=> {
        console.log(err);
      },
    })
    if(this.isAlumni){
      this.title='Event'
    }
    else if(this.isMentor){
      this.title='Event'
    }
    else{
      this.title='Registered Event'
    }
  }
  openRejectPopup(data:Event){
    data.Showdescription=true;
  }
  RejectEvent(data:Event){
    this.ChangeStatus('rejected',data.alumniId._id,data._id,data.description)
    data.Showdescription=false;
  }
  closeRejectPopup(data:Event){
    data.Showdescription=false;
    data.description='';
  }
  ChangeStatus(Status:String,alumniId:String,eventId: String,description: String = ''){
    const Update={
      status:Status,
      description:description
    }
    this.eventService.changeStatus(eventId,alumniId,Update).subscribe({
      next:(value)=> {
        this.toasterService.addToast('success','Success!','Status changed successfully.',5000);
      },
      error:(err)=> {
        this.toasterService.addToast('error','Error1',err.message,5000);
      },
    })

  }
  navigate(){
    if(this.isMentor)
      this.router.navigate(['event/create']);
    else
      this.router.navigate(['event/register']);
  }
  RegisteredStudent(data:Event){
    this.eventService.getAllReRegisteredStudents(data._id).subscribe({
      next:(value)=> {
        this.RegisterStudents=value.data.registerStudents
        data.showRegisterStudent=true;
      },
      error:(err)=> {
        this.toasterService.addToast('error','Error1',err.message,5000);
      },
    })
    
  }
  closeRegisteredStudent(data:Event){
    data.showRegisterStudent=false;
  }
  openRejectdescription(data:Event){
    if(this.isMentor)
      data.showRejectdescription=true;
  }
  closeRejectdescription(data:Event){
    data.showRejectdescription=false;
  }
  ShowUpdateEvent(data:Event){
    data.editEvent=true;
  }
  closeUpdateEvent(data:Event){
    data.editEvent=false;
  }
}

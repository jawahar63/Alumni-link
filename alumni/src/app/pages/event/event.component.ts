import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { TableComponent } from '../../components/table/table.component';
import { EventService } from '../../servies/event.service';
import { AuthService } from '../../servies/auth.service';
import { Event } from '../../models/event.model';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../../servies/toaster.service';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [HeaderComponent,TableComponent,CommonModule,FormsModule],
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
  event:Event[]=[]

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
  }
  openRejectPopup(data:Event){
    data.Showdescription=true;
    // this.ChangeStatus('rejected',data.alumniId._id,data._id)
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
}

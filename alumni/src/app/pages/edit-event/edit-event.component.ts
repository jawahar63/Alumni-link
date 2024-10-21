import { Component, inject, Input} from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Event, EventMode, eventuser } from '../../models/event.model';
import { EventService } from '../../servies/event.service';
import { ToasterService } from '../../servies/toaster.service';
import { AuthService } from '../../servies/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [TableComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent {
  @Input() event:Event={} as Event;
  id:string='';
  isMentor=false;
  eventForm!:FormGroup;
  modeEnum=EventMode;
  venues: string[] = ['SF 1', 'SF 2','SF 3', 'Main Auditorium', 'Vedhanayagam Auditorium','ECE Seminar Hall','Bio Seminar Hall'];
  filteredVenues: string[] = [];
  showSuggestions: boolean = false;
  showAlumniSuggestions: boolean = false;
  alumnis:eventuser[]=[]
  filteredAlumni:eventuser[]=[]
  fb=inject(FormBuilder);
  eventService=inject(EventService);
  toasterService=inject(ToasterService);
  authService=inject(AuthService);
  router=inject(Router)

  ngOnInit(): void {
    console.log(this.event);
    const fromDate = this.event?.fromDate ? new Date(this.event.fromDate).toISOString().substring(0, 10) : null;
    const toDate = this.event?.toDate ? new Date(this.event.toDate).toISOString().substring(0, 10) : null;
    this.authService.AuthData.subscribe((data)=>{
      this.id=data.get('user_id');
      this.isMentor=data.get('role')==='mentor';
    })
    if(!this.isMentor)
      this.router.navigate(['home'])
    this.eventForm=this.fb.group({
      createdBy:[this.id],
      eventName:[this.event?.eventName,[Validators.required]],
      alumniId:[this.event?.alumniId._id,[Validators.required]],
      typeofEvent:[this.event?.typeofEvent,[Validators.required]],
      fromDate:[fromDate,[Validators.required]],
      toDate:[toDate,[Validators.required]],
      mode:[this.event?.mode,[Validators.required]],
      venue:[this.event?.venue],
    })

    this.eventService.getAlumni().subscribe({
      next:(value)=> {
        this.alumnis=value.data;
      },
      error:(err)=> {
        this.toasterService.addToast('error','Error1',err.message,5000);
      },
    })
  }
  onAlumniInput(): void {
    const input = this.eventForm.get('alumniId')?.value.toLowerCase() || '';
    this.filteredAlumni = this.alumnis.filter(alumni =>
      alumni.username.toLowerCase().includes(input)
    );
  }

  selectAlumni(alumniId: String): void {
    this.eventForm.patchValue({ alumniId });
    this.showAlumniSuggestions = false;
  }

  hideAlumniSuggestions(): void {
    setTimeout(() => {
      this.showAlumniSuggestions = false;
    }, 200);
  }



  onVenueInput(): void {
    const input = this.eventForm.get('venue')?.value?.toLowerCase() || '';
    this.filteredVenues = this.venues.filter(venue =>
      venue.toLowerCase().includes(input)
    );
  }

  selectVenue(venue: String): void {
    this.eventForm.patchValue({ venue });
    this.showSuggestions = false;
  }

  hideSuggestions(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
  submitEventForm() {
    this.event.editEvent=false;
    if (this.eventForm.valid) {
      this.eventService.updateEvent(this.event._id,this.eventForm.value).subscribe({
        next:(value)=> {

          this.toasterService.addToast("success","Success!","Event Add Successfully",5000);
        },
        error:(err)=> {
          this.toasterService.addToast("error","Error!","Something Went Wrong, Try later",5000);
        },
      })
    }
  }
}

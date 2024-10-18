import { Component, inject, OnInit } from '@angular/core';
import { TableComponent } from "../../components/table/table.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventMode, eventuser } from '../../models/event.model';
import { CommonModule } from '@angular/common';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { User } from '../../models/post.model';
import { EventService } from '../../servies/event.service';
import { ToasterService } from '../../servies/toaster.service';
import { AuthService } from '../../servies/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [TableComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent implements OnInit {
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
    this.authService.AuthData.subscribe((data)=>{
      this.id=data.get('user_id');
      this.isMentor=data.get('role')==='mentor';
    })
    if(!this.isMentor)
      this.router.navigate(['home'])
    this.eventForm=this.fb.group({
      createdBy:[this.id],
      eventName:['',[Validators.required]],
      alumniId:['',[Validators.required]],
      typeofEvent:['',[Validators.required]],
      fromDate:['',[Validators.required]],
      toDate:['',[Validators.required]],
      mode:['',[Validators.required]],
      venue:[''],
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
    if (this.eventForm.valid) {
      this.eventService.createEvent(this.eventForm.value).subscribe({
        next:(value)=> {
          this.router.navigate(['event']);
          this.toasterService.addToast("success","Success!","Event Add Successfully",5000);
        },
        error:(err)=> {
          this.toasterService.addToast("error","Error!","Something Went Wrong, Try later",5000);
        },
      })
    }
  }
}

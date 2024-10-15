import { Component, inject, OnInit } from '@angular/core';
import { EventService } from '../../servies/event.service';
import { ToasterService } from '../../servies/toaster.service';
import { AuthService } from '../../servies/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-event',
  standalone: true,
  imports: [],
  templateUrl: './register-event.component.html',
  styleUrl: './register-event.component.css'
})
export class RegisterEventComponent implements OnInit {
  id:string='';
  isStudent=false;
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
    // this.eventService.
  }
}

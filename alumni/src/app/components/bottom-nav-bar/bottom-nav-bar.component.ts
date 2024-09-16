import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servies/auth.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { faHouse, faMagnifyingGlass, faPlus, faPenToSquare, faMessage, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-bottom-nav-bar',
  standalone: true,
  imports: [CommonModule,MatIcon],
  templateUrl: './bottom-nav-bar.component.html',
  styleUrl: './bottom-nav-bar.component.css'
})
export class BottomNavBarComponent implements OnInit{
  router=inject(Router);
  authservice=inject(AuthService);


  isMentor:boolean=false;
  isAlumni:boolean=false;
  activeSection: string = 'home';


  faHouse = faHouse;
  faMagnifyingGlass = faMagnifyingGlass;
  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  faMessage = faMessage;
  faCalendarDays = faCalendarDays;

  ngOnInit(): void {
    this.authservice.AuthData.subscribe((data)=>{
      this.isMentor='mentor'===data.get('role');
      this.isAlumni='alumni'===data.get('role');
    })
    
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    this.router.navigate([section]);
  }

}

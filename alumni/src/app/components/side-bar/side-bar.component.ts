import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';
import { SideBarService } from '../../servies/side-bar.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../servies/auth.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MatIconModule,CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter, :leave', [
        animate(300, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class SideBarComponent implements OnInit{
  router=inject(Router);
  mentor:boolean=false;
  ishome:boolean=false;
  ismessage:boolean=false;
  isevent:boolean=false;
  isregister:boolean=false;
  isSidebarVisible = false;
  sidebar=inject(SideBarService);
  authservice=inject(AuthService);
  isLoggedIn:boolean=false;
  outsideclick!:boolean;
  
  ngOnInit(): void {

    this.authservice.isLoggedIn$.subscribe(res=>{
      this.isLoggedIn=this.authservice.isLoggedIn();
      if(localStorage.getItem("role")==="mentor"){
      this.mentor=true;
    }
    })

    // if(localStorage.getItem("role")==="mentor"){
    //   this.mentor=true;
    // }

    this.sidebar.sidebarVisibility$.subscribe((isVisible) => {
      this.isSidebarVisible = isVisible;
    });
     this.checkScreenWidth();

    // Check screen width on window resize
    window.addEventListener('resize', () => {
      this.checkScreenWidth();
    });

    this.router.events.subscribe((val) => {
      if (this.router.url === '/home') {
        this.ishome = true;
        this.ismessage = false;
        this.isevent = false;
        this.isregister = false;
      } else if (this.router.url === '/message') {
        this.ishome = false;
        this.ismessage = true;
        this.isevent = false;
        this.isregister = false;
      } else if (this.router.url === '/event') {
        this.ishome = false;
        this.ismessage = false;
        this.isevent = true;
        this.isregister = false;
      } else if (this.router.url === '/register') {
        this.ishome = false;
        this.ismessage = false;
        this.isevent = false;
        this.isregister = true;
      }
    });
  
  }
  checkScreenWidth(): void {
    this.isSidebarVisible = window.innerWidth > 766;
    this.outsideclick=window.innerWidth < 766;
  }


  home(){
    this.router.navigate(['home']);
  }
  message(){
    this.router.navigate(['message']);
  }
  event(){
    this.router.navigate(['event']);
  }
  register(){
    this.router.navigate(['register']);
  }
  toggleSidebar() {
  if(screen.width<768){
    this.sidebar.toggleSidebar();
  }
  }
}

import { Component, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { AuthService } from '../../servies/auth.service';
import { routes } from '../../app.routes';
import { Router, RouterModule } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { SideBarService } from '../../servies/side-bar.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProfileService } from '../../servies/profile.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SideBarComponent,MatIconModule,CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  
  sanitizer=inject(DomSanitizer);
  authservice=inject(AuthService);
  profileservice=inject(ProfileService);
  socialAuthService=inject(SocialAuthService);
  isLoggedIn:boolean=false
  router =inject(Router)
  sidebar =inject(SideBarService);
  isProfileDropdownOpen: boolean = false;
  searchbarvisible:boolean=false;
  screenSizeSearchbar:boolean=false;
  isalumni:boolean=false;
  username!:string |null;
  profilePhoto!:SafeUrl|null;
  id!:string;
  details!:object;
  


  ngOnInit(): void {
    // this.checkExpiration();
    this.authservice.isLoggedIn$.subscribe(res=>{
      this.isLoggedIn=this.authservice.isLoggedIn();
      this.username=sessionStorage.getItem('username');
      if(sessionStorage.getItem('role')==="alumni"){
      this.isalumni=true;
    }
    })

    this.id=sessionStorage.getItem('user_id')||'';
    this.username=sessionStorage.getItem('username');

    const photoUrl: string | null = sessionStorage.getItem('photo');
    this.profilePhoto = photoUrl;

    this.sidebar.searchbarVisibility$.subscribe((visible)=>{
      this.searchbarvisible=visible;
    })

    this.checkScreenWidth();
    window.addEventListener('resize',()=>{
      this.checkScreenWidth();
    })

  }

 logout(){
  localStorage.removeItem('token');
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("photo");
    this.authservice.isLoggedIn$.next(false);
    this.router.navigate(['login']);
    this.socialAuthService.signOut();
 }

 toggleSidebar() {
  if(screen.width<768){
    this.sidebar.toggleSidebar();
  }
  }

  toggleSearch(){
    this.sidebar.toggleSearch();
  }

  checkScreenWidth(): void {
    this.screenSizeSearchbar = window.innerWidth < 800;
  }

  viewProfile():void{
    this.router.navigate(['profile/'+this.id]);
  }
  // checkExpiration() {
  //   const expirationTime = localStorage.getItem("expirationTime");
  //   const currentTime = new Date().getTime();

  //   if (expirationTime === null || currentTime > parseInt(expirationTime, 10)) {
  //     this.logout();
  //   }
  // }
}

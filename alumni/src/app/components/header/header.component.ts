import { Component, HostListener, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
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
import { ToasterService } from '../../servies/toaster.service';
import { SearchService } from '../../servies/search.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule,ReactiveFormsModule],
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
  toasterService=inject(ToasterService);
  searchService=inject(SearchService);
  isProfileDropdownOpen: boolean = false;
  searchbarvisible:boolean=false;
  screenSizeSearchbar:boolean=false;
  isalumni:boolean=false;
  username!:string |null;
  profilePhoto!:SafeUrl|null;
  id!:string;
  details!:object;
  role!:string;
  searchTermControl = new FormControl();
  suggestions: any[] = [];
  


  ngOnInit(): void {
    this.authservice.isLoggedIn$.subscribe(res=>{
      this.isLoggedIn=this.authservice.isLoggedIn();
    })
    this.authservice.AuthData.subscribe((data)=>{
      this.username=data.get('username');
      this.role = data.get('role')
        this.isalumni=this.role==="alumni";
      this.id=data.get('user_id');
    this.username=data.get('username');
    this.profilePhoto = data.get('photo');
    })

    this.sidebar.searchbarVisibility$.subscribe((visible)=>{
      this.searchbarvisible=visible;
    })

    this.checkScreenWidth();
    window.addEventListener('resize',()=>{
      this.checkScreenWidth();
    })
    this.searchTermControl.untouched
    this.searchTermControl.valueChanges.pipe(
      debounceTime(300),
      switchMap(searchTerm => {
        if (searchTerm) {
          return this.searchService.autoSuggest(searchTerm); 
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
      }
    );

  }

 logout(){
  localStorage.removeItem('token');
    this.authservice.isLoggedIn$.next(false);
    this.router.navigate(['login']);
    this.socialAuthService.signOut();
    this.toasterService.addToast('success','Success!','Logout successfully.',5000);
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
    if(this.role==='alumni')
    this.router.navigate(['profile/'+this.id]);
  }
  // checkExpiration() {
  //   const expirationTime = localStorage.getItem("expirationTime");
  //   const currentTime = new Date().getTime();

  //   if (expirationTime === null || currentTime > parseInt(expirationTime, 10)) {
  //     this.logout();
  //   }
  // }


  selectSuggestion(suggestion: any) {
    this.searchTermControl.setValue('');
    this.suggestions = [];
  }
  openPost(id:String){
    this.router.navigate(['posts/'+id]);
    this.searchTermControl.setValue('');
    this.suggestions = [];

  }
  openProfile(id:String){
    this.router.navigate(['profile/'+id]);
    this.searchTermControl.setValue('');
    this.suggestions = [];
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const isClickInside = target.closest('.suggestion-box') || target.closest('.search-input');
    if (!isClickInside) {
      this.suggestions = []; // Clear suggestions if click is outside
    }
  }
}

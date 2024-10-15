import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { SideBarComponent } from '../components/side-bar/side-bar.component';
import { Router, RouterOutlet } from '@angular/router';
import { SideBarService } from '../servies/side-bar.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../servies/auth.service';
import { JwtdecodeService } from '../servies/jwtdecode.service';
import { ToasterComponent } from '../components/toaster/toaster.component';
import { ProfileComponent } from "../pages/profile/profile.component";
import { BottomNavBarComponent } from '../components/bottom-nav-bar/bottom-nav-bar.component';
import { TableComponent } from '../components/table/table.component';
import { ToasterService } from '../servies/toaster.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, SideBarComponent, RouterOutlet, CommonModule, ToasterComponent, ProfileComponent,BottomNavBarComponent,TableComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'] // Corrected styleUrl to styleUrls
})
export class MainComponent implements OnInit {
  sidebar = inject(SideBarService);
  router = inject(Router);
  isSidebarVisible = true;
  authservice = inject(AuthService);
  jwtDecode = inject(JwtdecodeService);
  toasterService=inject(ToasterService);
  socialAuthService=inject(SocialAuthService);
  isLoggedIn: boolean = false;
  decodedtoken: any;

  ngOnInit(): void {
    this.sidebar.startRouteMonitoring();
    this.authservice.isLoggedIn$.subscribe((res) => {
      this.isLoggedIn = this.authservice.isLoggedIn();
    });
    if (!this.isLoggedIn) {
      this.router.navigate(['login']);
    }
    

    this.sidebar.sidebarVisibility$.subscribe((isVisible) => {
      this.isSidebarVisible = isVisible;
    });
    this.authservice.AuthData.subscribe((data)=>{
      if(!data.has('token')){
        const token = localStorage.getItem('token') || '';
        this.authservice.updateAuthData('token', token);
        this.decodedtoken = this.jwtDecode.decodetoken(token);
        if (this.decodedtoken===null) {
          return;
        }
        this.authservice.updateAuthData('user_id', this.decodedtoken.id);
        this.authservice.updateAuthData('role', this.decodedtoken.roles[0].role);

      if (this.decodedtoken.roles[0].role === 'alumni') {
        this.authservice.updateAuthData('batch', this.decodedtoken.batch);
        this.authservice.updateAuthData('domain', this.decodedtoken.domain);
        this.authservice.updateAuthData('company', this.decodedtoken.company);
      }

      this.authservice.updateAuthData('username', this.decodedtoken.username);
      this.authservice.updateAuthData('photo', this.decodedtoken.profileImage);
      }
    })
  }
}

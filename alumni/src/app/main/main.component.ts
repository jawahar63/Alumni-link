import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { SideBarComponent } from '../components/side-bar/side-bar.component';
import { Router, RouterOutlet } from '@angular/router';
import { SideBarService } from '../servies/side-bar.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../servies/auth.service';
import { JwtdecodeService } from '../servies/jwtdecode.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, SideBarComponent, RouterOutlet, CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'] // Corrected styleUrl to styleUrls
})
export class MainComponent implements OnInit {
  sidebar = inject(SideBarService);
  router = inject(Router);
  isSidebarVisible = true;
  authservice = inject(AuthService);
  jwtDecode = inject(JwtdecodeService);
  isLoggedIn: boolean = false;
  decodedtoken: any;

  ngOnInit(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['login']);
    }

    // Subscription for login status and sidebar visibility
    this.authservice.isLoggedIn$.subscribe((res) => {
      this.isLoggedIn = this.authservice.isLoggedIn();
    });

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

      // Set AuthData based on decoded token

    // Check for user ID in AuthData and token in local storage
    // if (!this.authservice.AuthData.get('user_id') && localStorage.getItem('token')) {
    //   const token = localStorage.getItem('token') || '';
    //   this.decodedtoken = this.jwtDecode.decodetoken(token);

    //   if (this.decodedtoken !== null) {
    //     sessionStorage.setItem('user_id', this.decodedtoken.id);
    //     sessionStorage.setItem('role', this.decodedtoken.roles[0].role);

    //     if (this.decodedtoken.roles[0].role === 'alumni') {
    //       sessionStorage.setItem('batch', this.decodedtoken.batch);
    //       sessionStorage.setItem('domain', this.decodedtoken.domain);
    //       sessionStorage.setItem('company', this.decodedtoken.company);
    //     }

    //     sessionStorage.setItem('username', this.decodedtoken.username);
    //     sessionStorage.setItem('photo', this.decodedtoken.profileImage);
    //   }
    // }
  }
}

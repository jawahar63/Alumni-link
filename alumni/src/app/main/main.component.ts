import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { SideBarComponent } from '../components/side-bar/side-bar.component';
import { RouterOutlet } from '@angular/router';
import { SideBarService } from '../servies/side-bar.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../servies/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent,SideBarComponent,RouterOutlet,CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit{
  sidebar=inject(SideBarService);
  isSidebarVisible = true;
  authservice=inject(AuthService);
  isLoggedIn:boolean=false;

  ngOnInit(): void {
    this.sidebar.sidebarVisibility$.subscribe((isVisible) => {
      this.isSidebarVisible = !isVisible;
    });
    this.authservice.isLoggedIn$.subscribe(res=>{
      this.isLoggedIn=this.authservice.isLoggedIn();
    })
  }
}

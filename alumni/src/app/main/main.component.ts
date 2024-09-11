import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { SideBarComponent } from '../components/side-bar/side-bar.component';
import { RouterOutlet } from '@angular/router';
import { SideBarService } from '../servies/side-bar.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../servies/auth.service';
import { Token } from '@angular/compiler';
import { JwtdecodeService } from '../servies/jwtdecode.service';

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
  jwtDecode=inject(JwtdecodeService);
  isLoggedIn:boolean=false;
  decodedtoken:any;

  ngOnInit(): void {
    this.sidebar.sidebarVisibility$.subscribe((isVisible) => {
      this.isSidebarVisible = isVisible;
    });
    this.authservice.isLoggedIn$.subscribe(res=>{
      this.isLoggedIn=this.authservice.isLoggedIn();
      if(!sessionStorage.getItem('user_id')&& localStorage.getItem('token')){
      const token=localStorage.getItem("token")||'';
      this.decodedtoken=this.jwtDecode.decodetoken(token);
      sessionStorage.setItem("user_id",this.decodedtoken.id);
      console.log(this.decodedtoken.roles);
      sessionStorage.setItem("role",this.decodedtoken.roles[0].role);
      if(this.decodedtoken.roles[0].role=="alumni"){
        sessionStorage.setItem("batch",this.decodedtoken.batch);
        sessionStorage.setItem("domain",this.decodedtoken.domain);
        sessionStorage.setItem("company",this.decodedtoken.company);
      }
      sessionStorage.setItem("username",this.decodedtoken.username);
      sessionStorage.setItem("photo",this.decodedtoken.profileImage);
      // this.authservice.getUserDataservie(this.decodedtoken.id).subscribe({
      //   next:(res)=>{
      //     console.log(res);
      //     sessionStorage.setItem("username",res.message.username);
      //     sessionStorage.setItem("photo",res.message.profileImage);
      //   }
      // })
    }
    });
    
  }
}

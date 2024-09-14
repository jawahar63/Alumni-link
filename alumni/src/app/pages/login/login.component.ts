declare var google:any;

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../servies/auth.service';
import { Router, RouterModule } from '@angular/router';
import { GoogleSigninButtonDirective, GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { JwtdecodeService } from '../../servies/jwtdecode.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,RouterModule,GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  fb=inject(FormBuilder);
  loginForm!:FormGroup;
  authservice=inject(AuthService);
  router =inject(Router);
  jwtDecode=inject(JwtdecodeService);
  isLoggedIn:boolean=false;
  socialAuthServie=inject(SocialAuthService);
  googleEmail!:any;
  decodedtoken!:any;
  loginErr!:String;

  ngOnInit(): void {

    this.socialAuthServie.authState.subscribe((result)=>{
      this.googleEmail=result;
      this.googleLogin();
    });

    this.isLoggedIn=this.authservice.isLoggedIn();
    if(this.isLoggedIn){
      this.router.navigate(['home']);
    }
    this.loginForm=this.fb.group({
      email:['',Validators.compose([Validators.required,Validators.email])],
      password:['',Validators.required],
    });
  }
  login() {
  this.authservice.loginServie(this.loginForm.value).subscribe({
    next: (res) => {
      localStorage.setItem("token", res.access_token);
      this.authservice.updateAuthData("token", res.access_token);
      
      const token = localStorage.getItem("token") || '';
      this.decodedtoken = this.jwtDecode.decodetoken(token);
      
      if (this.decodedtoken) {
        this.authservice.updateAuthData("user_id", this.decodedtoken.id);
        this.authservice.updateAuthData("role", this.decodedtoken.roles[0].role);
        
        if (this.decodedtoken.roles[0].role === "alumni") {
          this.authservice.updateAuthData("batch", this.decodedtoken.batch);
          this.authservice.updateAuthData("domain", this.decodedtoken.domain);
          this.authservice.updateAuthData("company", this.decodedtoken.company);
        }
        
        this.authservice.updateAuthData("username", this.decodedtoken.username);
        this.authservice.updateAuthData("photo", this.decodedtoken.profileImage);

        this.authservice.isLoggedIn$.next(true);
        this.router.navigate(['home']);
      }
    },
    error: (err) => {
      this.loginErr = err.error.message;
    }
  });
}

googleLogin() {
  this.authservice.googleLoginServie(this.googleEmail).subscribe({
    next: (res) => {
      localStorage.setItem("token", res.access_token);
      this.authservice.updateAuthData("token", res.access_token);
      
      const token = localStorage.getItem("token") || '';
      this.decodedtoken = this.jwtDecode.decodetoken(token);
      
      if (this.decodedtoken) {
        this.authservice.updateAuthData("user_id", this.decodedtoken.id);
        this.authservice.updateAuthData("role", this.decodedtoken.roles[0].role);
        
        if (this.decodedtoken.roles[0].role === "alumni") {
          this.authservice.updateAuthData("batch", this.decodedtoken.batch);
          this.authservice.updateAuthData("domain", this.decodedtoken.domain);
          this.authservice.updateAuthData("company", this.decodedtoken.company);
        }
        
        this.authservice.updateAuthData("username", this.decodedtoken.username);
        this.authservice.updateAuthData("photo", this.decodedtoken.profileImage);
        
        this.authservice.isLoggedIn$.next(true);
        this.router.navigate(['home']);
      }
    },
    error: (err) => {
      this.loginErr = err.error.message;
    }
  });
}

}

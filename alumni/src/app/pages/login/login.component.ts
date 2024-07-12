declare var google:any;

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../servies/auth.service';
import { Router, RouterModule } from '@angular/router';
import { GoogleSigninButtonDirective, GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';

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
  authServie=inject(AuthService);
  router =inject(Router);
  isLoggedIn:boolean=false;
  socialAuthServie=inject(SocialAuthService);
  googleEmail!:any;
  loginErr!:String;

  ngOnInit(): void {

    this.socialAuthServie.authState.subscribe((result)=>{
      this.googleEmail=result;
      localStorage.setItem("photo",result.photoUrl);
      this.googleLogin();
    });

    this.isLoggedIn=this.authServie.isLoggedIn();
    if(this.isLoggedIn){
      this.router.navigate(['home']);
    }
    this.loginForm=this.fb.group({
      email:['',Validators.compose([Validators.required,Validators.email])],
      password:['',Validators.required],
    });
  }
  login(){
    this.authServie.loginServie(this.loginForm.value).subscribe({
      next:(res)=>{
        localStorage.setItem("token",res.access_token);
        // localStorage.setItem("user_id",res.data._id);
        // localStorage.setItem("role",res.data.roles[0].role);
        // localStorage.setItem("username",res.data.username);
        // localStorage.setItem("photo",res.data.profileImage);
        this.authServie.isLoggedIn$.next(true); 
        this.loginForm.reset;
        this.router.navigate(['home']);
      },
      error:(err)=> {
        this.loginErr=err.error.message;
      },
    })
  }
  googleLogin(){
    this.authServie.googleLoginServie(this.googleEmail).subscribe({
        next:(res)=>{
          localStorage.setItem("user_id",res.data._id);
          localStorage.setItem('role',res.data.roles[0].role);
          localStorage.setItem("username",res.data.username);
          this.authServie.isLoggedIn$.next(true);
          this.router.navigate(['home']);
        },
        error:(err)=> {
          this.loginErr=err.error.message;
        },

      })
  }
}

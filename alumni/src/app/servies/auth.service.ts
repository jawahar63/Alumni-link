import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http =inject(HttpClient)

  isLoggedIn$ =new BehaviorSubject<boolean>(false);

  registerServie(registerObj:any){
    return this.http.post<any>(`${apiUrls.authServiceApi}register`,registerObj);
  }
  loginServie(loginObj:any){
    return this.http.post<any>(`${apiUrls.authServiceApi}login`,loginObj);
  }
  sendEmailServie(email:string){
    return this.http.post<any>(`${apiUrls.authServiceApi}send-email`,{email:email});
  }
  resetServie(resetObj:any){
    return this.http.post<any>(`${apiUrls.authServiceApi}reset`,resetObj);
  }
  isLoggedIn(){
    return !!localStorage.getItem("user_id");
  }
  isMentor(){
    return !!localStorage.getItem("role");
  }
  googleLoginServie(loginObj:any){
    return this.http.post<any>(`${apiUrls.authServiceApi}google-login`,loginObj);
  }
}

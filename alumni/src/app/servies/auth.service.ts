import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { BehaviorSubject } from 'rxjs';
import { JwtdecodeService } from './jwtdecode.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http =inject(HttpClient);
  decodedtoken!:string;
  jwtDecode=inject(JwtdecodeService);
  public AuthData = new BehaviorSubject<Map<string, any>>(new Map());

  isLoggedIn$ =new BehaviorSubject<boolean>(false);


  updateAuthData(key: string, value: any) {
    const data = this.AuthData.getValue();
    data.set(key, value);
    this.AuthData.next(data);
  }
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
    const token=localStorage.getItem("token")||'';
    this.decodedtoken=this.jwtDecode.decodetoken(token);
    return this.decodedtoken!==null;
  }
  googleLoginServie(loginObj:any){
    return this.http.post<any>(`${apiUrls.authServiceApi}google-login`,loginObj);
  }
  getUserDataservie(id:string){
    return this.http.get<any>(`${apiUrls.authServiceApi}getdata/${id}`,);
  }
}

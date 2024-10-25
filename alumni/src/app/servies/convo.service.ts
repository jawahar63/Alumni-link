import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConvoService {

  http=inject(HttpClient);
  token=localStorage.getItem('token')||'';
  header=new HttpHeaders({
    'authorization':`Bearer ${this.token}`
  });

  constructor() { }

  createConvo(participants:String[]){
    return this.http.post<any>(`${apiUrls.convoservice}/createConvo`,participants,{
      headers:this.header
    });
  }
  getConvo(userId:String){
    console.log(userId)
    return this.http.get<any>(`${apiUrls.convoservice}/getConvo/${userId}`,{
      headers:this.header
    })
  }
  searchUser(query: string): Observable<any>{
    return this.http.get(`${apiUrls.convoservice}/search?query=${query}`,{
      headers:this.header
    })
  }
}

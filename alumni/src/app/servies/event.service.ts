import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrls } from '../api.urls';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  http =inject(HttpClient);
  token:string = localStorage.getItem('token')||'';
  header=new HttpHeaders({
    'authorization': `Bearer ${this.token}`
  });

  getEvent(id:String){
    return this.http.get<any>(`${apiUrls.EventService}/getEvent/${id}`,{
      headers:this.header
    });
  }
  changeStatus(id:String,alumniId:String,Update:any){
    return this.http.put<any>(`${apiUrls.EventService}/changeEventStatus/${id}/${alumniId}`,Update,{
      headers:this.header
    })
  }
  getAlumni(){
    return this.http.get<any>(`${apiUrls.userService}/alumni`,{
      headers:this.header
    })
  }
  createEvent(event:Event){
    return this.http.post<any>(`${apiUrls.EventService}/createEvent`,event,{
      headers:this.header
    })
  }
}

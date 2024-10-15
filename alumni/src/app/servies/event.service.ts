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
    console.log(Update)
    return this.http.put<any>(`${apiUrls.EventService}/changeEventStatus/${id}/${alumniId}`,Update,{
      headers:this.header
    })
  }
}

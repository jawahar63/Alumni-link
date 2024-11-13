import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrls } from '../api.urls';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  http =inject(HttpClient);
  token:string = localStorage.getItem('token')||'';
  header=new HttpHeaders({
    'authorization': `Bearer ${this.token}`
  });


  private socket: Socket;

  constructor() {
    this.socket = io(apiUrls.io);
  }

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
  getApprovedEvent(id:String){
    return this.http.get<any>(`${apiUrls.EventService}/getAllAprovedEvent/${id}`,{
      headers:this.header
    })
  }
  RegisterEvent(eventId:String,studentId:String){
    return this.http.put<any>(`${apiUrls.EventService}/registerStudents/${eventId}/${studentId}`,{},{
      headers:this.header
    })
  }
  getAllReRegisteredStudents(eventId:String){
    return this.http.get<any>(`${apiUrls.EventService}/getAllRegisteredStudent/${eventId}`,{
      headers:this.header
    })
  }
  updateEvent(eventId:String,event:Event){
    return this.http.put<any>(`${apiUrls.EventService}/updateEvent/${eventId}`,event,{
      headers:this.header
    })
  }
  deleteEvent(eventId:String,mentorId:String){
    return this.http.delete<any>(`${apiUrls.EventService}/deleteEvent/${eventId}/${mentorId}`,{
      headers:this.header
    })
  }
  public onCreate() {
    return new Observable<Event>(observer => {
      this.socket.on('newEvent', (event:Event) => {
        observer.next(event);
      });
    });
  }
  public onUpdate() {
    return new Observable<Event>(observer => {
      this.socket.on('updateEvent', (event:Event) => {
        observer.next(event);
      });
    });
  }
  public onChangeStatus() {
    return new Observable<Event>(observer => {
      this.socket.on('statusEventChange', (event:Event) => {
        observer.next(event);
      });
    });
  }
  public onRegister() {
    return new Observable<Event>(observer => {
      this.socket.on('RegisterEvent', (event:Event) => {
        observer.next(event);
      });
    });
  }
  public onDelete(){
    return new Observable<String>(observer => {
      this.socket.on('deleteEvent', (event) => {
        observer.next(event);
      });
    });
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrls } from '../api.urls';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { MessageService } from './message.service';
import { Convo } from '../models/convo.model';

@Injectable({
  providedIn: 'root'
})
export class ConvoService {

  http=inject(HttpClient);
  messageService=inject(MessageService)
  token=localStorage.getItem('token')||'';
  header=new HttpHeaders({
    'authorization':`Bearer ${this.token}`
  });

  private socket: Socket;

  constructor() {
    this.socket = this.messageService.socket;
  }

  createConvo(participants:String[]){
    return this.http.post<any>(`${apiUrls.convoservice}/createConvo`,{participants},{
      headers:this.header
    });
  }
  getConvo(userId:String){
    return this.http.get<any>(`${apiUrls.convoservice}/getConvo/${userId}`,{
      headers:this.header
    })
  }
  getOrCreate(participants:String[]){
    return this.http.post<any>(`${apiUrls.convoservice}/getOrCreateConvo`,{participants},{
      headers:this.header
    })
  }
  searchUser(query: string): Observable<any>{
    return this.http.get(`${apiUrls.convoservice}/search?query=${query}`,{
      headers:this.header
    })
  }

  changeConvoDetail():Observable<Convo>{
    return new Observable((observer)=>{
      this.socket.on('ConvoDataChange', (message) => {
        observer.next(message);
      });
    })
  }
}

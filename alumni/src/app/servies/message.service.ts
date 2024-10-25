import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrls } from '../api.urls';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  http=inject(HttpClient);
  token=localStorage.getItem('token')||'';
  header=new HttpHeaders({
    'authorization':`Bearer ${this.token}`
  });

  constructor() { }

  sendMessage(data:any){
    return this.http.post<any>(`${apiUrls.messageService}/send`,data,{
      headers:this.header
    });
  }

  getMessages(convoId:String){
    return this.http.get<any>(`${apiUrls.messageService}/getConvo/${convoId}`,{
      headers:this.header
    })
  }
  readMessage(messageId:String){
    return this.http.patch<any>(`${apiUrls.messageService}/read/${messageId}`,{},{
      headers:this.header
    })
  }
  deleteMessage(messageId:String){
    return this.http.delete<any>(`${apiUrls.messageService}/delete/${messageId}`,{
      headers:this.header
    })
  }
  getUnreadMessageCount(userId:String){
    return this.http.get<any>(`${apiUrls.messageService}/unread/${userId}`,{
      headers:this.header
    })
  }
  getLastMessage(userId:String){
    return this.http.get<any>(`${apiUrls.messageService}/last/${userId}`,{
      headers:this.header
    })
  }
}

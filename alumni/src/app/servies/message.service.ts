import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrls } from '../api.urls';
import { BehaviorSubject, Observable } from 'rxjs';
import { Convo, Message } from '../models/convo.model';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  http=inject(HttpClient);
  token=localStorage.getItem('token')||'';
  header=new HttpHeaders({
    'authorization':`Bearer ${this.token}`
  });

  private Convodetail = new BehaviorSubject<Convo>({
    _id: '',
    createdAt: new Date(),
    lastMessage: '',
    lastMessageAt: new Date(),
    participant: {
        _id: '',
        username: '',
        email: '',
        profileImage: '',
    },
    unreadMessageCount: 0
});
  ConvoDetail$=this.Convodetail.asObservable();


  socket: Socket;

  constructor() {
    this.socket = io(apiUrls.io);
  }

  getConvoDetail(convo:Convo){
    this.Convodetail.next(convo);
  }

  sendMessage(data:any){
    return this.http.post<any>(`${apiUrls.messageService}/send`,data,{
      headers:this.header
    });
  }
  
  getMessages(convoId:String,user_id:String){
    return this.http.get<any>(`${apiUrls.messageService}/getMessage/${convoId}/${user_id}`,{
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
  joinChat(roomId: string) {
    this.socket.emit('joinChat', roomId);
  }
  sendMessageSocket(room: string, message: string) {
    this.socket.emit('sendMessage', { room, message });
  }
  changeIsRecieve(message:Message){
    const room=message.conversationId
    this.socket.emit('changeIsRecieve',{room ,message});
  }
  changeIsRead(message:Message){
    const room=message.conversationId
    this.socket.emit('changeIsRead',{room ,message});
  }
  receiveMessage(): Observable<Message> {
    return new Observable((observer) => {
      this.socket.on('receiveMessage', (message) => {
        observer.next(message);
      });
    });
  }
  messageIsReceive():Observable<Message>{
    return new Observable((observer) => {
      this.socket.on('isReceive', (message) => {
        observer.next(message);
      });
    });
  }
  messageIsReceiveArray():Observable<Message[]>{
    return new Observable((observer) => {
      this.socket.on('IsReceiveArray', (messages) => {
        observer.next(messages.messages);
      });
    });
  }
  messageIsSeen():Observable<Message>{
    return new Observable((observer) => {
      this.socket.on('isRead', (message) => {
        observer.next(message);
      });
    });
  }
  messagesIsSeen():Observable<Message[]>{
    return new Observable((observer) => {
      this.socket.on('updatedMessages', (message) => {
        console.log(1);
        observer.next(message);
      });
    });
  }
}

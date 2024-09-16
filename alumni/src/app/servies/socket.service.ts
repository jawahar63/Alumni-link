import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:4000');
  }

  public sendMessage(message:string){
    this.socket.emit('message',message);
  }
  public onMessage() {
    return new Observable(observer => {
      this.socket.on('message', (message) => {
        observer.next(message);
      });
    });
  }

  onNewPost(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('newPost', (post) => {
        observer.next(post);
      });
    });
  }

  onNewComment(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('newComment', (comment) => {
        observer.next(comment);
      });
    });
  }

  onNewLike(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('newLike', (like) => {
        observer.next(like);
      });
    });
  }
}

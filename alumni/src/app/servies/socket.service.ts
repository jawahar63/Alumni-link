import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { apiUrls, liveUrl } from '../api.urls';
import { AuthService } from './auth.service';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  authservice = inject(AuthService);
  id = '';

  private newPostSubject = new Subject<any>();
  private newCommentSubject = new Subject<any>();
  private newLikeSubject = new Subject<any>();

  constructor() {
    this.socket = io(apiUrls.io);
    this.authservice.AuthData.subscribe((data) => {
      this.id = data.get('user_id');
    });

    this.socket.on('newPost', (post) => {
      this.newPostSubject.next(post);
      this.showPushNotification(`${post.caption} by ${post.author.username} received`, 'You have a new post.',`${liveUrl.PostUrl}${post._id}`);
    });

    this.socket.on('newComment', (comment) => {
      if (this.id === comment.authorId) {
        this.showPushNotification(`${comment.comment.text} by ${comment.comment.commenter.username} received`, 'You have a new comment.',`${liveUrl.PostUrl}${comment.postId}`);
      }
      this.newCommentSubject.next(comment);
    });
    this.socket.on('newLike', (like) => {
      if (this.id === like.authorId) {
        console.log(like.like);
        this.showPushNotification(`${like.like.liker.username} liked your Post`, 'You have a new like.',`${liveUrl.PostUrl}${like.postId}`);
      }
      this.newLikeSubject.next(like);
    });
  }

  onNewPost(): Observable<any> {
    return this.newPostSubject.asObservable().pipe(
      shareReplay(1) 
    );
  }

  onNewComment(): Observable<any> {
    return this.newCommentSubject.asObservable().pipe(
      shareReplay(1) 
    );
  }


  onEditPost(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('editPost', (post) => {
        observer.next(post);
      });
    });
  }

  onDeletePost(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('deletePost', (post) => {
        observer.next(post);
      });
    });
  }

  onNewLike(): Observable<any> {
    return this.newLikeSubject.asObservable().pipe(
      shareReplay(1) 
    );
  }

  onDeleteComment(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('deleteComment', (comment) => {
        observer.next(comment);
      });
    });
  }

  onEditComment(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('editComment', (comment) => {
        observer.next(comment);
      });
    });
  }

  private showPushNotification(title: string, body: string,url?:String): void {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, { body });

      if(url){
        notification.onclick = () => {
          window.focus(); 
          window.location.href = `${url}`;
        };
      }

    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          const notification = new Notification(title, { body });
          if(url){
            notification.onclick = () => {
              window.focus(); 
              window.location.href = `${url}`;
            };
          }
        }
      });
    }
  }

}

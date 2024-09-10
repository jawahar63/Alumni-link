import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrls } from '../api.urls';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  http=inject(HttpClient);
  createPost(Post:any){
    return this.http.post<any>(`${apiUrls.PostService}/create-post`,Post);
  }
  getallPost(){
    return this.http.get<any>(`${apiUrls.PostService}/posts`);
  }
  Addcomment(postId:string,comment:any){
    return this.http.post<any>(`${apiUrls.PostService}/${postId}/newcomment`,comment)
  }

  getComment(postId:string){
    return this.http.get<any>(`${apiUrls.PostService}/${postId}/comments`);
  }
  getPostByAuthor(authorId:string){
    return this.http.get<any>(`${apiUrls.PostService}/posts/author/${authorId}`);
  }
}
